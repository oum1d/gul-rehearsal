# Мини-сервер статики на чистом PowerShell.
#
# Нужен НЕ для работы сайта — сайт открывается двойным кликом по index.html.
# Пригодится, только если нужен протокол http://: проверка sitemap.xml,
# отладка сетевых запросов или режим rooms.json вместо rooms.js.
#
# Запуск из папки проекта:
#     powershell -ExecutionPolicy Bypass -File serve.ps1
# Остановка: Ctrl+C
#
# Путь берётся от самого скрипта, а не прописан строкой: в пути есть кириллица,
# а PowerShell 5.1 читает .ps1 без BOM как ANSI и такую строку испортил бы.

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 8099

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
} catch {
    Write-Output "Port $port busy or blocked. Close the other server and retry."
    exit 1
}

Write-Output "http://localhost:$port/  ->  $root"
Write-Output "Ctrl+C to stop"

while ($listener.IsListening) {
    $ctx = $null
    try {
        $ctx = $listener.GetContext()
        $path = [System.Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath)
        if ($path -eq '/') { $path = '/index.html' }

        $rel = $path.TrimStart('/') -replace '/', '\'
        $file = Join-Path $root $rel

        # Защита от выхода за пределы папки проекта (../../ в адресе)
        $full = [System.IO.Path]::GetFullPath($file)
        if (-not $full.StartsWith([System.IO.Path]::GetFullPath($root))) {
            $ctx.Response.StatusCode = 403
            $ctx.Response.Close()
            continue
        }

        if (Test-Path -LiteralPath $full -PathType Leaf) {
            switch ([System.IO.Path]::GetExtension($full).ToLower()) {
                '.html' { $type = 'text/html; charset=utf-8' }
                '.css'  { $type = 'text/css; charset=utf-8' }
                '.js'   { $type = 'application/javascript; charset=utf-8' }
                '.json' { $type = 'application/json; charset=utf-8' }
                '.svg'  { $type = 'image/svg+xml' }
                '.xml'  { $type = 'application/xml; charset=utf-8' }
                '.png'  { $type = 'image/png' }
                '.jpg'  { $type = 'image/jpeg' }
                '.webp' { $type = 'image/webp' }
                '.woff2' { $type = 'font/woff2' }
                default { $type = 'text/plain; charset=utf-8' }
            }
            $bytes = [System.IO.File]::ReadAllBytes($full)
            $ctx.Response.StatusCode = 200
        } else {
            $bytes = [System.IO.File]::ReadAllBytes((Join-Path $root '404.html'))
            $type = 'text/html; charset=utf-8'
            $ctx.Response.StatusCode = 404
        }

        $ctx.Response.ContentType = $type
        $ctx.Response.ContentLength64 = $bytes.Length
        # На HEAD отдаются только заголовки. Попытка записать тело роняла
        # обработчик, ответ не закрывался, и браузер ждал его бесконечно.
        if ($ctx.Request.HttpMethod -ne 'HEAD') {
            $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
        }
        $ctx.Response.Close()
    } catch {
        Write-Output "err: $_"
        # Любая ошибка обработчика — всё равно закрываем соединение
        if ($ctx) { try { $ctx.Response.Abort() } catch {} }
    }
}
