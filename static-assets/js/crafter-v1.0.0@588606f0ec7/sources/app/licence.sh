#!/usr/bin/env bash

readonly LICENSE=`cat license.txt`

cd src
readonly FILES=`find -E . -regex '.*\.(ts|tsx)'`

for file in ${FILES}; do
  echo "Applying license to ${file}"

  echo "${LICENSE}" > ${file}.lic
  echo "$f" >> ${file}.lic
  cat ${file} >> ${file}.lic
  mv ${file}.lic ${file}

  # TODO: Check if file has license already?
  # if [[  ]]; then
    # /^(\/\*)((?s).*)(Copyright)((?s).*)(\*\/)/U
  # fi
done
