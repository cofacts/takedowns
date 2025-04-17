# Cofacts takedowns script

[![CI](https://github.com/cofacts/takedowns/actions/workflows/ci.yml/badge.svg)](https://github.com/cofacts/takedowns/actions/workflows/ci.yml) [![Coverage Status](https://coveralls.io/repos/github/cofacts/takedowns/badge.svg?branch=master)](https://coveralls.io/github/cofacts/takedowns?branch=master)

## Moderation

### Review the pull request

- When the takedown bot creates a pull request:
  - If the user is confirmed as a spammer:
    - Approve the pull request
    - Merge the pull request
    - The system will automatically block the user
  - If the user is not a spammer (false positive):
    - Simply close the pull request
    - No further action needed

## Develop

### Env setup

Please see `.env.sample` file

### Run takedown

``` shell
npm run takedown
```

### Test

``` shell
npm test
```

### Test with langfuse dataset

> Note: make sure you set LANGFUSE_KEY first

``` shell
node src/__tests__/manual/langfuseDataset.js
```
