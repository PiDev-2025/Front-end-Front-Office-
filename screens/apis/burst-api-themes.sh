#!/usr/bin/env zsh

# Function to make a single request
make_request() {
    local response=$(curl -s -m 1 -w "%{http_code} %{time_total}\n" -H "Authorization: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3Mzc1NTM0MTAsIm5iZiI6MTczNzU1MzQxMCwiZXhwIjoxNzM3NTU3MDEwLCJpc3MiOiJTdXJyZWFsREIiLCJqdGkiOiJmYTk1YWIwNS1hZTBmLTRhMTMtYWNiNy05MDA5MzI3ZTg1ODgiLCJOUyI6InN3IiwiREIiOiJjb3JlIiwiQUMiOiJhdXRoIiwiSUQiOiJ1c2VyOjg2ZDlxNzFva3J6ZjV2ZGN2M3FsIn0.sFgfBihQupmuycGsEwNvtawLxaILUSvb_IvcNeGh8VCkPb0hR8lTQdT5ULBK8CB5UPRIvThxPv08qXLl0jhmVg" -H "content-type: application/json" "https://api-sw.qazar.cloud/core/theme/" 2>&1)
    echo "$response"
}

# Make 10000 requests in parallel with a max of 100 at a time using zsh
for i in {1..10000}; do
    { 
        echo "Request $i:"
        make_request
    } &
    if (( $i % 100 == 0 )); then
        wait
    fi
done
wait