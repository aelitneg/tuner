# tuner

A simple, free tuner. 

## [➡️ Live Demo](https://tuner.aelitneg.com)

## About

The original purpose of this project was to learn more about using the [MediaDevices](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices) and [WebAudio](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) APIs in a React based environment. It has served as a jumping off point for further exploration into pitch detection and animation on the HTML `<cavas>` element. 

A free hosted version of the tuner is available at https://tuner.aelitneg.com. The source code is also provided free and open source under the MIT license. 

## Setup

Follow these steps to run the tuner locally on your computer. 

1. Download the repository from GitHub
    ```sh
    git clone https://github.com/aelitneg/tuner.git
    ```
1.  In the tuner directory, install the dependencies
    ```sh
    npm ci
    ```
1. Start the development server
    ```sh
    npm run dev
    ```
1. The tuner should now be running at http://localhost:3000

### Debug

To enable the AudioContext clock on the canvas, create .env.local and set the variable:

```sh
NEXT_PUBLIC_DEBUG=true
```
