const { mock } = require('node:test')
const sodium = require('libsodium-wrappers')

/** @typedef {import('../src/api')} Api */
/** @typedef {import('@octokit/types').OctokitResponse<any>} OctokitResponse */

let testPublicKey

/**
 * Initialize a test key pair for encryption tests
 * @returns {Promise<string>} Base64-encoded public key
 */
async function initTestKey() {
  if (!testPublicKey) {
    await sodium.ready
    const keyPair = sodium.crypto_box_keypair()
    testPublicKey = Buffer.from(keyPair.publicKey).toString('base64')
  }
  return testPublicKey
}

/**
 * Get the initialized test public key
 * @returns {string} Base64-encoded public key
 */
function getTestPublicKey() {
  return testPublicKey
}

/**
 * Mock the Octokit request method on an Api instance
 * @param {Api} api - Api instance to mock
 * @param {{status: number, data: any}} setSecretResponse - Response to return for setSecret calls
 * @returns {function(): any} Function that returns captured secret data
 */
function mockOctokit(api, setSecretResponse = { status: 201, data: {} }) {
  let capturedData = null
  api.octokit.request = mock.fn(async (endpoint, params) => {
    if (endpoint.includes('public-key')) {
      return { data: { key_id: 'test-key-id', key: testPublicKey } }
    }
    capturedData = params && params.data
    return setSecretResponse
  })
  return () => capturedData
}

/**
 * Replicates the bootstrap logic from index.js for testing
 * @param {Api} api - Api instance
 * @param {string} secretName - Secret name
 * @param {string} secretValue - Secret value
 * @param {import('@actions/core')} core - Mock @actions/core module
 * @returns {Promise<{status: number, data: any}>} API response
 */
async function bootstrap(api, secretName, secretValue, core) {
  try {
    const { key_id, key } = await api.getPublicKey()
    const data = await api.createSecret(key_id, key, secretName, secretValue)

    if (api.isOrg()) {
      data.visibility = core.getInput('visibility')
      if (data.visibility === 'selected') {
        data.selected_repository_ids = core.getInput('selected_repository_ids')
      }
    }

    const response = await api.setSecret(data, secretName)

    if (response.status >= 400) {
      core.setFailed(response.data)
    } else {
      core.setOutput('status', response.status)
      core.setOutput('data', response.data)
    }
    return response
  } catch (e) {
    core.setFailed(e.message)
    throw e
  }
}

module.exports = {
  initTestKey,
  getTestPublicKey,
  mockOctokit,
  bootstrap
}
