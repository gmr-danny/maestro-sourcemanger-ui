// import moment, { Moment } from 'moment';
// import { Event } from 'microsoft-graph';
// import { GraphRequestOptions, PageCollection, PageIterator } from '@microsoft/microsoft-graph-client';

var graph = require('@microsoft/microsoft-graph-client');

function getAuthenticatedClient(accessToken) {
    // Initialize Graph client
    const client = graph.Client.init({
        // Use the provided access token to authenticate
        // requests
        authProvider: (done) => {
            done(null, accessToken);
        }
    });

    return client;
}

export async function getUserDetails(accessToken) {
    const client = getAuthenticatedClient(accessToken);

    const user = await client
        .api('/.default')
        // .select('displayName,mail,mailboxSettings,userPrincipalName')
        .get();


    return user;
}