# Готовит фотографии для сайта из tools/photos-raw.
#
#   assets/img/rooms/<name>-lg.jpg  — галерея комнаты, 1200x900 (баннер студии 1280x720)
#   assets/img/rooms/<name>-sm.jpg  — карточки и миниатюры, 600x450 (640x360)
#   assets/data/rooms.js            — блок photoCredits между метками
#   CREDITS.md                      — таблица авторов и лицензий
#
# Запуск из папки проекта:
#     powershell -ExecutionPolicy Bypass -File tools\prepare-photos.ps1
#
# Файл сохранён в UTF-8 с BOM. Без BOM PowerShell 5.1 читает скрипт как ANSI
# и портит русский текст, который скрипт пишет в CREDITS.md.
#
# КОГДА КЛИЕНТ ПРИШЛЁТ НАСТОЯЩИЕ ФОТО БАЗЫ
# Положить их в tools/photos-raw под теми же именами (a-1.jpg … studio.jpg),
# удалить tools/photos-raw/credits.json и запустить скрипт. Кадры пройдут
# ту же тонировку, а подписи авторов на сайте исчезнут сами.

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$tools = Split-Path -Parent $MyInvocation.MyCommand.Path
$root = Split-Path -Parent $tools
$raw = Join-Path $tools 'photos-raw'
$dst = Join-Path $root 'assets\img\rooms'
if (-not (Test-Path $dst)) { New-Item -ItemType Directory -Force -Path $dst | Out-Null }

$utf8 = New-Object System.Text.UTF8Encoding($false)
$manifest = [System.IO.File]::ReadAllText((Join-Path $tools 'photos.json'), $utf8) | ConvertFrom-Json
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }

# ============================================================================
# ТОНИРОВКА
# ----------------------------------------------------------------------------
# Одна матрица цвета на всю серию. Для каждого пикселя:
#   яркость L = 0.299 R + 0.587 G + 0.114 B
#   контраст и яркость вокруг середины: L' = (L - 0.5) * contrast + 0.5 + brightness
#   цвет = shadow + (highlight - shadow) * L'
# Всё это линейно, поэтому укладывается в одну ColorMatrix и считается
# видеокартой GDI+ за один проход, а не циклом по миллиону пикселей.
# ============================================================================
function Hex([string]$hex) {
  $h = $hex.TrimStart('#')
  # Скобки вокруг каждого деления обязательны: в PowerShell запятая связывает
  # сильнее деления, и без скобок 16 / 255.0, … превращается в деление на массив
  return @(
    ([Convert]::ToInt32($h.Substring(0, 2), 16) / 255.0),
    ([Convert]::ToInt32($h.Substring(2, 2), 16) / 255.0),
    ([Convert]::ToInt32($h.Substring(4, 2), 16) / 255.0)
  )
}

$grade = $manifest.grade
$lo = Hex $grade.shadow
$hi = Hex $grade.highlight
$c = [double]$grade.contrast
$b = [double]$grade.brightness

# exposure у отдельного кадра в photos.json добавляется к общей яркости:
# тёмный подвальный снимок подтягивается, не меняя тон всей серии
function New-GradeMatrix([double]$b) {
$cm = New-Object System.Drawing.Imaging.ColorMatrix
$offset = 0.5 - 0.5 * $c + $b
# GDI+ умножает строку [R G B A 1] на матрицу: MatrixIJ — вклад входа I в выход J
$cm.Matrix00 = ($hi[0] - $lo[0]) * $c * 0.299; $cm.Matrix01 = ($hi[1] - $lo[1]) * $c * 0.299; $cm.Matrix02 = ($hi[2] - $lo[2]) * $c * 0.299
$cm.Matrix10 = ($hi[0] - $lo[0]) * $c * 0.587; $cm.Matrix11 = ($hi[1] - $lo[1]) * $c * 0.587; $cm.Matrix12 = ($hi[2] - $lo[2]) * $c * 0.587
$cm.Matrix20 = ($hi[0] - $lo[0]) * $c * 0.114; $cm.Matrix21 = ($hi[1] - $lo[1]) * $c * 0.114; $cm.Matrix22 = ($hi[2] - $lo[2]) * $c * 0.114
$cm.Matrix40 = $lo[0] + ($hi[0] - $lo[0]) * $offset
$cm.Matrix41 = $lo[1] + ($hi[1] - $lo[1]) * $offset
$cm.Matrix42 = $lo[2] + ($hi[2] - $lo[2]) * $offset
$cm.Matrix33 = 1; $cm.Matrix44 = 1
return $cm
}

function New-Frame($img, [int]$W, [int]$H, [double]$fx, [double]$fy, $cm) {
  $ratio = $W / $H
  if ($img.Width / $img.Height -gt $ratio) {
    $ch = $img.Height; $cw = [int]($ch * $ratio)
    $cx = [int](($img.Width - $cw) * $fx); $cy = 0
  } else {
    $cw = $img.Width; $ch = [int]($cw / $ratio)
    $cx = 0; $cy = [int](($img.Height - $ch) * $fy)
  }
  # Мелкий исходник не растягиваем: апскейл даёт мыло, а не детали
  if ($cw -lt $W) { $W = $cw; $H = [int]($cw / $ratio) }

  $bmp = New-Object System.Drawing.Bitmap($W, $H)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

  $attrs = New-Object System.Drawing.Imaging.ImageAttributes
  $attrs.SetColorMatrix($cm)
  # Без этого бикубика тянет прозрачность из-за края кадра — по периметру светлая кайма
  $attrs.SetWrapMode([System.Drawing.Drawing2D.WrapMode]::TileFlipXY)

  $g.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $W, $H)), $cx, $cy, $cw, $ch, [System.Drawing.GraphicsUnit]::Pixel, $attrs)

  # Виньетка: эллипс шире кадра, центр прозрачный, к краям темнее.
  # Сводит кадры с разной экспозицией по краям — глаз читает серию как одну съёмку.
  $v = [double]$grade.vignette
  if ($v -gt 0) {
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddEllipse([int](-$W * 0.25), [int](-$H * 0.25), [int]($W * 1.5), [int]($H * 1.5))
    $brush = New-Object System.Drawing.Drawing2D.PathGradientBrush($path)
    $brush.CenterColor = [System.Drawing.Color]::FromArgb(0, 0, 0, 0)
    $brush.SurroundColors = @([System.Drawing.Color]::FromArgb([int](255 * $v), 0, 0, 0))
    $brush.FocusScales = New-Object System.Drawing.PointF(0.45, 0.45)
    $g.FillRectangle($brush, 0, 0, $W, $H)
    $brush.Dispose(); $path.Dispose()
  }

  $attrs.Dispose(); $g.Dispose()
  return $bmp
}

# Подбор качества под бюджет: кадр не тяжелее заданного числа КБ.
# Бюджет — ради телефона в подвале с плохой связью, главного сценария сайта.
function Save-Budget($bmp, [string]$out, [int]$q, [int]$minQ, [int]$budgetKB) {
  do {
    $params = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$q)
    $bmp.Save($out, $codec, $params)
    $kb = (Get-Item $out).Length / 1KB
    $q -= 4
  } while ($kb -gt $budgetKB -and $q -ge $minQ)
  return @{ kb = [math]::Round($kb); q = $q + 4; size = "$($bmp.Width)x$($bmp.Height)" }
}

# ============================================================================
# КАДРЫ
# ============================================================================
$total = 0
$done = @()
foreach ($p in $manifest.photos) {
  $src = Join-Path $raw ($p.name + '.jpg')
  if (-not (Test-Path $src)) { Write-Output ("missing raw: " + $p.name); continue }

  if ($p.ratio -eq '16:9') { $lg = @(1280, 720); $sm = @(640, 360) } else { $lg = @(1200, 900); $sm = @(600, 450) }

  $exposure = if ($p.exposure) { [double]$p.exposure } else { 0 }
  $matrix = New-GradeMatrix ($b + $exposure)
  $img = [System.Drawing.Image]::FromFile($src)
  try {
    $big = New-Frame $img $lg[0] $lg[1] $p.fx $p.fy $matrix
    $a = Save-Budget $big (Join-Path $dst ($p.name + '-lg.jpg')) 82 56 170
    $big.Dispose()

    $small = New-Frame $img $sm[0] $sm[1] $p.fx $p.fy $matrix
    $s = Save-Budget $small (Join-Path $dst ($p.name + '-sm.jpg')) 80 54 55
    $small.Dispose()

    $total += $a.kb + $s.kb
    $done += $p.name
    '{0,-7} lg {1,-9} {2,4} KB q{3}   sm {4,-8} {5,3} KB q{6}' -f $p.name, $a.size, $a.kb, $a.q, $s.size, $s.kb, $s.q
  } finally {
    $img.Dispose()
  }
}
"images total: $total KB"

# ============================================================================
# АВТОРЫ -> rooms.js и CREDITS.md
# ----------------------------------------------------------------------------
# Переписывать руками 17 строк с авторами и ссылками — верный способ ошибиться
# в лицензии. Источник один: credits.json, который собирает fetch-photos.ps1.
# ============================================================================
$creditsPath = Join-Path $raw 'credits.json'
$credits = @{}
if (Test-Path $creditsPath) {
  $json = [System.IO.File]::ReadAllText($creditsPath, $utf8) | ConvertFrom-Json
  foreach ($prop in $json.PSObject.Properties) { $credits[$prop.Name] = $prop.Value }
}

function Js([string]$s) { return '"' + ($s -replace '\\', '\\\\' -replace '"', '\"') + '"' }

# «Steve Knight from Halstead, United Kingdom» — так Flickr подписывает перенесённые
# снимки. Для подписи под кадром хватает имени.
function Short-Author([string]$a) { return ($a -replace '\s+from\s+.*$', '').Trim() }

$lines = @()
foreach ($name in $done) {
  if (-not $credits.ContainsKey($name)) { continue }
  $cr = $credits[$name]
  $lines += ('    {0}: {{ author: {1}, license: {2}, licenseUrl: {3}, source: {4} }}' -f `
    (Js $name), (Js (Short-Author $cr.author)), (Js $cr.license), (Js $cr.licenseUrl), (Js $cr.source))
}

if ($lines.Count) { $block = "  photoCredits: {`n" + ($lines -join ",`n") + "`n  }," }
else { $block = '  photoCredits: {},' }

$roomsPath = Join-Path $root 'assets\data\rooms.js'
$rooms = [System.IO.File]::ReadAllText($roomsPath, $utf8)
$pattern = '(?s)(// photoCredits:begin\r?\n).*?(\r?\n\s*// photoCredits:end)'
if ($rooms -notmatch $pattern) { throw 'rooms.js: markers photoCredits:begin/end not found' }
$rooms = [regex]::Replace($rooms, $pattern, { param($m) $m.Groups[1].Value + $block + $m.Groups[2].Value })
[System.IO.File]::WriteAllText($roomsPath, $rooms, $utf8)
"rooms.js: photoCredits = $($lines.Count)"

# --- CREDITS.md --------------------------------------------------------------
$md = New-Object System.Collections.Generic.List[string]
$md.Add('# Авторы фотографий')
$md.Add('')
$md.Add('Своих снимков у репбазы «ГУЛ» пока нет. На сайте стоят свободные фотографии')
$md.Add('настоящих репетиционных и студий с [Wikimedia Commons](https://commons.wikimedia.org/).')
$md.Add('Это временная замена — до съёмки самой базы.')
$md.Add('')
$md.Add('Серия подобрана так, чтобы читаться как одно здание: «Малая» и «Барабанная» —')
$md.Add('две комнаты одного подвала (бомбоубежище в Штутгарте), «Большая», «Каморка»')
$md.Add('и баннер студии — один студийный комплекс (Rockfield Studios). Детали аппарата —')
$md.Add('из серии Shixart1985.')
$md.Add('')
$md.Add('**Изменения во всех кадрах:** кадрирование, уменьшение размера, перевод в монохром')
$md.Add(('с тёплой тонировкой ({0} → {1}), контраст ×{2}, виньетка. Настройки обработки —' -f $grade.shadow, $grade.highlight, $grade.contrast))
$md.Add('`tools/photos.json` → `grade`, скрипт — `tools/prepare-photos.ps1`.')
$md.Add('')
$md.Add('Подпись «Фото: автор · лицензия» стоит под каждым кадром галереи и под баннером')
$md.Add('студии, полный список — на странице `credits.html`. Этот файл пересобирается')
$md.Add('скриптом, руками его не править.')
$md.Add('')
$md.Add('| Кадр | Где на сайте | Автор | Лицензия | Оригинал |')
$md.Add('|---|---|---|---|---|')
foreach ($p in $manifest.photos) {
  if (-not $credits.ContainsKey($p.name)) { continue }
  $cr = $credits[$p.name]
  $lic = if ($cr.licenseUrl) { '[{0}]({1})' -f $cr.license, $cr.licenseUrl } else { $cr.license }
  $title = ($cr.title -replace '\.jpe?g$', '') -replace '\s*\(\d{8,}\)$', ''
  $src = $cr.source -replace '\(', '%28' -replace '\)', '%29'
  $md.Add(('| {0} | {1} | {2} | {3} | [{4}]({5}) |' -f $p.name, $p.where, (Short-Author $cr.author), $lic, ($title -replace '\|', '/'), $src))
}
$md.Add('')
$md.Add('## О лицензиях')
$md.Add('')
$md.Add('- **CC BY** — можно использовать где угодно, в том числе коммерчески, с указанием')
$md.Add('  автора, лицензии и того, что изменено.')
$md.Add('')
$md.Add('## Когда появятся свои фото')
$md.Add('')
$md.Add('Положить их в `tools/photos-raw/` под теми же именами, удалить')
$md.Add('`tools/photos-raw/credits.json` и запустить `tools/prepare-photos.ps1`.')
$md.Add('Подписи авторов на сайте исчезнут сами; этот файл, `credits.html` и ссылку')
$md.Add('«Авторы фото» в подвале после этого можно удалить.')
[System.IO.File]::WriteAllText((Join-Path $root 'CREDITS.md'), ($md -join "`n") + "`n", $utf8)
"CREDITS.md: $($credits.Count) rows"
