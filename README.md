# DT-BLOG-BOILERPLATE

> View [my blog](https://discretetom.github.io/) to preview this boilerplate.

<details>

<summary>Table of Contents</summary>

- [DT-BLOG-BOILERPLATE](#dt-blog-boilerplate)
  - [Features](#features)
  - [How to Use](#how-to-use)
    - [Modify Your Github Repository](#modify-your-github-repository)
    - [Setup Personal Access Token](#setup-personal-access-token)
    - [Setup Github Actions](#setup-github-actions)
    - [Organize Your Content](#organize-your-content)
  - [Configuration](#configuration)
    - [Global Configuration](#global-configuration)
    - [Folder Configuration](#folder-configuration)
    - [Markdown Front Matter](#markdown-front-matter)
  - [How to Test Locally](#how-to-test-locally)
  - [FAQ](#faq)

</details>

## Features

- Content/Style splitting.
  - Blog content and style are in separate repositories.
- Easy content organization.
  - Posts order are decided by filenames.
- Auto generate tags page.
  - Posts and folders are both supported.
- Mathjax support.
- Google analytics support.

## How to Use

### Modify Your Github Repository

If you gonna deploy your blog for your **user repo**, which means your repo name is `<username>.github.io`, you have to deploy your rendered content to your master branch, so you have to put your content in another branch, e.g. `source`. For a better accessibility you can set this `source` branch as the default branch of the blog repository.

### Setup Personal Access Token

This repo uses [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages) to deploy to github pages.
See [this part](https://github.com/peaceiris/actions-gh-pages#%EF%B8%8F-set-personal-access-token-personal_token) to generate a personal access token, then add it to your repo **Secrets** in the Settings page.

### Setup Github Actions

> Tips: you can always see my [blog source code](https://github.com/DiscreteTom/discretetom.github.io) as a reference.

In the source branch, create a file `.github/workflows/main.yml` with the following content:

```yaml
name: Github Pages

on:
  push:
    branches:
      - source # your source branch name

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: setup node
        uses: actions/setup-node@master

      - name: checkout boilerplate
        uses: actions/checkout@v2
        with:
          repository: DiscreteTom/dt-blog-boilerplate
          path: boilerplateRepo
          persist-credentials: false

      - name: checkout blog
        uses: actions/checkout@v2
        with:
          ref: source # your source branch name
          path: contentRepo
          persist-credentials: false

      - name: cache
        id: cache
        uses: actions/cache@v1
        with:
          path: ~/.npm
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-

      - name: install & generate
        run: |
          cp -r contentRepo/* boilerplateRepo
          cd boilerplateRepo/dt-blog-boilerplate
          npm install
          npm run generate

      - name: deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          personal_token: ${{ secrets.GH_PAT }} # your personal access token
          publish_branch: master # target branch
          publish_dir: boilerplateRepo/dt-blog-boilerplate/dist
```

### Organize Your Content

You source branch should have the following structure:

```
├─.github/
│ └─workflows/
│   └─main.yml
├─content/
│ └─<order>@<foldername>/
│   ├─_config.yml
│   ├─<order>@<filename>
│   └─_img/
│     └─<filename>
├─_config.yml
└─other_custom_files
```

E.g.:

```
├─.github/
│ └─workflows/
│   └─main.yml
├─content/
| ├─_config.yml                       # content root folder config
│ ├─1@posts/                          # order + folder name
│ | ├─_config.yml                     # folder config
│ | ├─1@how-to-write-blogs.md         # order + file name
│ | ├─2.5@my-second-post.md           # order can be decimal
│ | ├─3@.md                           # file name can be omitted, default to order
│ | ├─test.md                         # order can be omitted, default to 0
│ | ├─_ignore_me.md                   # files starts with '_' will be ignored
│ | └─_img/
│ |   └─title.jpg
| └─100@about.md
├─_config.yml                         # global config
└─README.md
```

You can use `./_img/filename` in a markdown file to reference an image under the `_img` folder: `![](./_img/filename)`.

## Configuration

### Global Configuration

The content of `_config.yml` in the root folder:

```yaml
title: DiscreteTom's Blog Boilerplate # site title
author: "" # author github username
email: "" # author email address
repo: "" # github repo address
root: index # root page path
folderIcon: mdi-folder-outline # mdi icon name
fileIcon: mdi-file # mdi icon name
orderDecider: "@" # can be multiple characters
reverse: false # reverse dirents order
description: # default to title
headScripts: [] # to append custom scripts
friends:
  - title: xxx
    url: https://example.com/
    description: xxx
friendsIcon: mdi-open-in-new
```

The `headScripts` can be used to append google analytics tracking code:

```yaml
headScripts: # to append custom scripts
  - src: https://www.googletagmanager.com/gtag/js?id=UA-XXXXXXXXX
    async: true
  - innerHTML: |
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'UA-XXXXXXXXX');
```

### Folder Configuration

The `content` folder and its sub-folders can contain a `_config.yml` file.

```yaml
icon: # current folder's icon, default to global config.folderIcon
orderDecider: # current folder's orderDecider, default to global config.orderDecider
title: # current folder's title, default to folder's name
reverse: # current folder's reverse, default to global config.reverse
description: # default to title
img: # title img
tags: [] # a string list
```

### Markdown Front Matter

```yaml
---
title: # default to markdown file name without orderDecider and suffix
icon: # default to global config.fileIcon
tags: [] # a string list
img: # title img
description: # default to title
toc: true # enable table of contents
siblings: true # enable previous/next post button
---

```

## How to Test Locally

1. Download this repository.
2. Create your content folder and global config file in this repository root folder.

After that, the structure of this repository folder should be like:

```
├─content/
│ └─...                   # your content here
├─_config.yml             # your global config
|
├─dt-blog-boilerplate/    # source code of the boilerplate
| ├─packages.json
│ └─...
└─...                     # other files
```

3. Go into the `dt-blog-boilerplate` folder(where the `package.json` is located), run `npm install`, then `npm run dev`.
4. View your blog site at http://localhost:3000.

## FAQ

- [Multiple lines Mathjax formulas flattened to one line?](https://github.com/wowchemy/wowchemy-hugo-modules/issues/291)
  - Use 6 backslashes for a Mathjax linebreak.