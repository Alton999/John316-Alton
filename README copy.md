# John 316

## Requirements

- Homebrew (https://brew.sh/)
  ```
  /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
  ```

- rbenv (https://github.com/rbenv/rbenv#homebrew-on-mac-os-x)
  ```
  brew install rbenv
  rbenv init
  ```

- Ruby 2.4.1
  ```
  rbenv install 2.4.1
  ```

- Bundler
  ```
  gem install bundler
  rbenv rehash
  ```

- nvm (https://github.com/creationix/nvm#install-script)
  ```
  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
  ```

- Node 6.3.1
  ```
  nvm install 6.3.1
  ```
- Xcode (recommended version: 8.3.3)
- Android Studio

## Setup

1. Install Ruby gems

    ```
    bundle install
    ```

1. Install Node dependencies

    ```
    npm install
    ```

1. Install Cordova

    ```
    npm install -g cordova
    ```

## Running the app

- Browser

    ```
    cordova run browser
    ```

- iOS

    ```
    cordova run ios
    ```

- Android

    ```
    cordova run android
    ```

## Uploading to Hockey App (for iOS)

1. Update the version number in `config.xml`

1. Run the command

    ```
    bundle exec fastlane upload_to_hockey
    ```

## Generating APK file (for Android)

1. Update the version number in `config.xml`

1. Run the command

    ```
    cordova build android
    ```

1. The command will print the path of the `.apk` file.
