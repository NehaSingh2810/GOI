$resp = Invoke-RestMethod -Uri 'http://localhost:5000/api/news?page=1&limit=50' -UseBasicParsing
if (-not $resp.news) { Write-Output 'No news returned'; exit }
foreach ($n in $resp.news) {
  Write-Output ('TITLE: ' + ($n.title -replace "\n"," "))
  if ($n.imageUrl) { Write-Output ('IMAGE: ' + $n.imageUrl) } else { Write-Output 'IMAGE: <null>' }
  Write-Output '---'
}
