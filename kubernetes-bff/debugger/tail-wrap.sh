#!/bin/bash
#timeout 600 tail $* |jq -r .log
timeout 600 tail -n 100 $* |jq -r .log
