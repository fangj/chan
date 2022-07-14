# 把原文的html文件都转成utf8编码，因生成书籍的工具对utf8支持较好
$list = Get-ChildItem ..\raw\ -recurse *.html|%{$_.FullName}
$Utf8NoBomEncoding = New-Object System.Text.UTF8Encoding($False)
foreach ($i in $list){
Write-Host $i
$a = Get-Content $i
[System.IO.File]::WriteAllLines($i, $a, $Utf8NoBomEncoding)
}
echo