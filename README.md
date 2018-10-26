# Toilet Booking System - Serverless edition

## Overview

Serveless solution to manage Toilet booking.

## How to run this app

- Package the SAM template:

```sam package --template-file template.yaml --s3-bucket my-s3-bucket --output-template-file packaged.yaml```

- Deploy the package as a stack:

```sam deploy --template-file packaged.yaml --stack-name my-tbs-stack --capabilities CAPABILITY_IAM```
