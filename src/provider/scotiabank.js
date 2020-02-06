function scotiabank() {
    console.log('hello scotia');
    const eDetails = document.getElementById('accDetailsPanelTransaction');
    if (!eDetails) return null;
    // TODO: Support Pending Transactions too? Will require extra field on transactions.
    // const ePending = document.getElementById('pending_form');
    // const pending = extractTable(ePending);

    const details = extractTable(eDetails);
    console.log(details);
    return [];
}

export const provider = {
    name: 'Scotiabank',
    urls: ['www.scotiaonline.scotiabank.com'],
    version: '0.1',
    collect: () => scotiabank(),
}
