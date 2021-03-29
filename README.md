# Simples Online Audio Analysis

Simple HTML5 realtime audio analysis for both time domain and frequency domain.

You may access the app in my personal website: https://grossato.com/html5-simple-audio-analysis/

There are no analytics, no tracking, no ads or anything else, it is as simple as I could make it.

# How does it work?

This is just a simple implementation of the AudioContext API. It uses `window.AudioContext`'s `createAnalyser` method to create an analyzer and then we use `getByteFrequencyData` or `getByteTimeDomainData` to read the sound input buffers into a `UInt8Array` which is then displayed in a newly created canvas element.

# Can I use it for *********?

Yes, it is free and license-less.
