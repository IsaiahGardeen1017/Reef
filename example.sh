#!/bin/bash

echo 'STARTING'

while true; do
  # Generate a random 10-digit number
  # Using shuf to get a random 10-digit number from /dev/random
  # tr -dc '0-9' removes all non-digit characters
  # head -c 10 takes the first 10 characters
  RANDOM_NUMBER=$(</dev/random tr -dc '0-9' | head -c 10)

  # Print the random number
  echo "$RANDOM_NUMBER"

  # Wait for three seconds
  sleep 1
done
