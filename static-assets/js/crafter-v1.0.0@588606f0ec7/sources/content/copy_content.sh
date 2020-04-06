#!/bin/bash
#
# This script will copy the content here into your crafter site
#

cd "$(dirname "$0")"
site_dir="$(pwd)/../.."

while read content; do
    content_dir="${site_dir}/$(dirname "$content")"
    [[ ! -d "$content_dir" ]] && mkdir -p "$content_dir"
    cp -vf "$content" "$content_dir"
    [[ $? -ne 0 ]] && exit 1
done < <(find * -mindepth 2 -type f -not -name *.original)

exit 0