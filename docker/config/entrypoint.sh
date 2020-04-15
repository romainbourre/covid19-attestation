#!/bin/bash

set -e
service nginx start
touch log.log
tail -f log.log
