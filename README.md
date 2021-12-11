
# Description

This program will allow you to search for text in the entire mysql database.


# Instalation
```sh 
https://github.com/gkssjovi/mysqlsearch.git
cd mysqlsearch
yarn
chmod +x ./dist/main.js
ln -s $PWD/dist/main.js /usr/local/bin/mysqlsearch

cp config.yaml personal.config.yaml
mkdir ~/.config/mysqlsearch
ln -s $PWD/personal.config.yaml ~/.config/mysqlsearch/config.yaml
```

# Usage 
```sh
mysqlsearch
mysqlsearch -d <database_name> 'query'
mysqlsearch -u root -p '' -d <database_name> 'query'
mysqlsearch -u root -p '' -d <database_name> -f full 'query'
mysqlsearch -u root -p '' -d <database_name> -t <table_name> 'query'
```

![Image](./assets/image1.png)

# Help
`mysqlsearch --help`

```sh
mysqlsearch [command]

Commands:
  mysqlsearch <query>  Search query in database

Options:
      --help      Show help                                            [boolean]
      --version   Show version number                                  [boolean]
  -h, --host      Hostname                                              [string]
  -P, --port      Port                                                  [number]
  -u, --user      User                                                  [string]
  -p, --password  Password                                              [string]
  -d, --database  Database                                   [string] [required]
  -f, --format    Display formats <less, default, full>                 [string]
  -s, --style     Display with different style <solid, default, dashed> [string]
  -t, --table     Search only in a specific table                       [string]
```
