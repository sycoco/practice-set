#!/usr/bin/env sh

spectrum_address=`printenv "system.config.address"`
spectrum_key=`printenv "spectrum.key"`
spectrum_secret=`printenv "spectrum.secret"`

function loginSpectrum() {
  cookie=`curl -i -d "userName=${spectrum_key}&password=${spectrum_secret}" "${spectrum_address}/login"|grep Set-Cookie |sed 's/.*JSESSIONID=\([^;]*\).*/\1/g'`
  echo $cookie
}

function getAttributes() {
  cookie=$1
  attributes=`curl --cookie "JSESSIONID=$cookie" "${spectrum_address}/attributes/exportText?key=%2F${ENVIRONMENT}&recursiveUp=false&type=properties"`
  echo $attributes
}

function getAttribute() {
  attributes=$1
  key=$2
  attribute=`echo $attributes|sed 's/ /\n/g'|grep "^$key"|sed "s/.*$key=\(.*\)/\1/"`
  echo $attribute
}

cookie=$(loginSpectrum)
attributes=$(getAttributes "$cookie")
domain=$(getAttribute "$attributes" "system.domain")
ual_address=$(getAttribute "$attributes" "system.ual.address")

sed -i "s@\([ ]*window.API_HOST[ ]*=\)\([^,]*\)\(,*\)@\1 \"${ual_address}\"\3@g" /usr/share/nginx/html/le/index.html
sed -i "s@\([ ]*window.LOGIN_URL[ ]*=\)\([^,]*\)\(,*\)@\1 \"http://${domain}/portal/login.html\"\3@g" /usr/share/nginx/html/le/index.html

nginx -g "daemon off;"
