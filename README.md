# with-ssm

## Description

Short description of what the tool does

Describe the value of not having to store secrets on disk and ensure they are
always up to date, and why it is now possible to commit the `.env` (or
preferably the `.env.with-ssm` to avoid the caviots)

## Caviouts

- If the application reads the `.env` file it may override the replaced
  variables after, resulting in the original variables being used. In those
  cases, sustution could be used in implementaions which supports it
  `${NPM_TOKEN:-SSM:/access/npm_token}` or using a `.env.with-ssm` file instead,
  which would not be read by the application

- If the `.env` file is committed to the repo, it is important to remember to
  avoid deploying it along with the application.

## Install

```
npm i -g @morten-olsen/with-ssm
```

## Usage

### Using environment variables

```
NPM_TOKEN="SSM:/access/npm_token" with-ssm --debug -- npm whoami
```

### Using files

`.env.with-ssm` or `.env`

```
NPM_TOKEN="SSM:/access/npm_token"
```

```
with-ssm --debug -- npm whoami
```
