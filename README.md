# Ledgerize

Ledgerize is a Firefox WebExtension that faciliates converting bank
and credit card statements from various online-banking applications
into the Ledger CLI entry format for importing into an offline ledger
file.

## Core Features
- Website agnostic
- Open Source
- Rule-based Account assignation
- Multi-account support
- Extendable
- No tracking
- No telemetry
- No credentials
- Entry de-duplication

# Architecture
At its core, ledgerize is a simple rule engine with several banking
site providers responsible for extracting the information from
supported websites.

A small content script is injected in all supported websites and if
transaction data is available, it is sent to the extension's workers
to be converted into ledger entries. Those entries can then be copied
to the clipboard by pushing on the Ledgerize button with the open tabs.
