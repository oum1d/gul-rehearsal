# Скачивает фотографии из tools/photos.json с Wikimedia Commons в tools/photos-raw
# и собирает авторов и лицензии в tools/photos-raw/credits.json.
#
# Запуск из папки проекта:
#     powershell -ExecutionPolicy Bypass -File tools\fetch-photos.ps1
#
# Путь берётся от самого скрипта: в C:\Проэкты кириллица, а PowerShell 5.1
# читает .ps1 без BOM как ANSI и испортил бы такую строку.
#
# Что выяснено на практике (13 сентября 2026):
# - Commons отдаёт превью только стандартных ширин (960, 1280, 1920 …),
#   произвольная ширина — ошибка 400. Поэтому ширину просим через API.
# - Если оригинал уже нужной ширины, превью 1920 не существует и сервер
#   отвечает 429 бесконечно. Для таких файлов берём сам оригинал.
# - И сервер картинок, и API режут частые запросы (429). Скрипт ничего не
#   перекачивает и не переспрашивает: готовые файлы и уже известные авторы
#   пропускаются, так что повторный запуск дешёвый и продолжает с места обрыва.

$ErrorActionPreference = 'Stop'
$tools = Split-Path -Parent $MyInvocation.MyCommand.Path
$raw = Join-Path $tools 'photos-raw'
if (-not (Test-Path $raw)) { New-Item -ItemType Directory -Path $raw | Out-Null }

$manifest = Get-Content -LiteralPath (Join-Path $tools 'photos.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$ua = 'GUL-portfolio-site/1.0 (static demo; photo credits kept in credits.json)'
$creditsPath = Join-Path $raw 'credits.json'

# Уже собранные авторы — чтобы не спрашивать API повторно
$credits = [ordered]@{}
if (Test-Path $creditsPath) {
  $old = Get-Content -LiteralPath $creditsPath -Raw -Encoding UTF8 | ConvertFrom-Json
  foreach ($prop in $old.PSObject.Properties) { $credits[$prop.Name] = $prop.Value }
}

function Clean([string]$html) {
  if (-not $html) { return '' }
  $t = $html -replace '<[^>]+>', '' -replace '&amp;', '&' -replace '&quot;', '"' -replace '&#039;', "'" -replace '\s+', ' '
  return $t.Trim()
}

function Is429($err) {
  return $err.Exception.Response -and [int]$err.Exception.Response.StatusCode -eq 429
}

# Запрос с ожиданием при 429. Возвращает $null, если сервер так и не пустил.
# Лог внутри функции — только Write-Host: всё, что уходит в Write-Output,
# PowerShell добавляет к возвращаемому значению, и строка «429, wait…»
# превращалась в «успех» — скрипт считал файл скачанным, хотя его не было.
function Get-WithRetry([scriptblock]$call, [string]$label) {
  foreach ($wait in 0, 30, 90, 180) {
    if ($wait -gt 0) { Write-Host ("  429, wait {0}s: {1}" -f $wait, $label); Start-Sleep -Seconds $wait }
    try { return (& $call) }
    catch { if (-not (Is429 $_)) { throw } }
  }
  return $null
}

$changed = $false

foreach ($p in $manifest.photos) {
  $out = Join-Path $raw ($p.name + '.jpg')
  if ((Test-Path $out) -and (Get-Item $out).Length -lt 20KB) { Remove-Item $out -Force }

  $haveFile = Test-Path $out
  $haveCredit = $credits.Contains($p.name)
  if ($haveFile -and $haveCredit) { continue }

  $api = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo' +
         '&iiprop=url%7Csize%7Cextmetadata&iiurlwidth=1920&titles=' + [Uri]::EscapeDataString($p.title)

  $resp = Get-WithRetry { Invoke-RestMethod -Uri $api -UserAgent $ua -TimeoutSec 40 } ('api ' + $p.name)
  Start-Sleep -Seconds 3
  if (-not $resp) { Write-Output ("API GAVE UP: " + $p.name); continue }

  $page = $resp.query.pages.PSObject.Properties | Select-Object -First 1
  $ii = $page.Value.imageinfo[0]
  if (-not $ii) { Write-Output ("NOT FOUND: " + $p.title); continue }
  $m = $ii.extmetadata

  if (-not $haveFile) {
    # Оригинал не шире 2600 px берём целиком: превью 1920 для него не существует.
    # Хвост ?utm_source=… от API отрезаем: с ним запрос идёт мимо кеша.
    if ($ii.width -le 2600) { $urls = @($ii.url) }
    else { $urls = @($ii.thumburl, ($ii.thumburl -replace '/1920px-', '/1280px-')) }
    $urls = $urls | ForEach-Object { ($_ -split '\?')[0] }

    $ok = $false
    foreach ($url in $urls) {
      $res = Get-WithRetry {
        Invoke-WebRequest -Uri $url -OutFile $out -UserAgent $ua -TimeoutSec 120 -UseBasicParsing
        $true
      } ('file ' + $p.name)
      if ($res) { $ok = $true; break }
      if (Test-Path $out) { Remove-Item $out -Force }
    }
    Start-Sleep -Seconds 4
    if (-not $ok -or -not (Test-Path $out)) { Write-Output ("FILE GAVE UP: " + $p.name); continue }
  }

  $credits[$p.name] = [ordered]@{
    title      = ($p.title -replace '^File:', '')
    author     = Clean $m.Artist.value
    license    = Clean $m.LicenseShortName.value
    licenseUrl = if ($m.LicenseUrl) { $m.LicenseUrl.value } else { '' }
    source     = $ii.descriptionurl
    width      = $ii.width
    height     = $ii.height
  }
  $changed = $true
  '{0,-7} {1,5} KB  {2,-14} {3}' -f $p.name, [math]::Round((Get-Item $out).Length / 1KB), $credits[$p.name].license, $credits[$p.name].author
}

if ($changed) {
  $json = $credits | ConvertTo-Json -Depth 4
  [System.IO.File]::WriteAllText($creditsPath, $json, (New-Object System.Text.UTF8Encoding($false)))
}
'done: {0} photos with credits' -f $credits.Count
