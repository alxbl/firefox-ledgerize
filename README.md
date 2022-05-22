# Ledgerize

Ledgerize is a Firefox WebExtension that faciliates converting bank
and credit card statements from various online-banking applications
into the Ledger CLI entry format for importing into an offline ledger
file.

## Core Features

- Open Source and Simple code base
- Rule-based account assignation
- Multi-account support
- Extendable
- No tracking
- No telemetry
- No credentials
- Entry de-duplication

## Required Permissions

Ledgerize needs the following permissions to function:

- *clipboardWrite* to be able to fill the clipboard with the ledger entries.
- Access to read content from the supported banking websites in order to extract transaction data.

For a complete list of URLs, see `manifest.json`

## Currently Supported Sites

- Desjardins AccessD (All accounts)

## In Progress

- Scotiabank (Credit Card Statements)


## Architecture

At its core, ledgerize is a simple rule engine with several banking
site providers responsible for extracting the information from
supported websites.

A small content script is injected in all supported websites and if
transaction data is available, it is sent to the extension's workers
to be converted into ledger entries. Those entries can then be copied
to the clipboard by clicking on the Ledgerize button with the open tabs.

## Adding a Provider

**NOTE**: Stub; Needs to be expanded

- Add URLs in `manifest.json`
- Create and implement `provider/providerName.js`
- Add `providerName` imports in `providers.js`
- Test and create pull request

## Building the extension

Install all node dependencies:
```
npm install
```
Build the extension to the dist directory:
```
npm run build
```
