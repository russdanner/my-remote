#!/bin/bash
#
# This script will remove content here
#

cd "$(dirname "$0")"
site_dir="$(pwd)/../.."

# remove content
while read content; do
    rm "${site_dir}/${content}" 2>/dev/null
    if [[ -f "${site_dir}/${content}" ]]; then
        echo "Unable to remove test content $content"
        exit 1
    fi
done < <(find * -mindepth 2 -type f -not -name *.original)

# replace originals
while read content; do
    cp -f "${content}" "${site_dir}/$(dirname "$content")/$(basename "${content%.*}")"
    if [[ $? -ne 0 ]]; then
        echo "Unable to replace original file $content"
        exit 1
    fi
done < <(find * -mindepth 2 -type f -name *.original)

exit 0