const { describe, it, mock, beforeEach, before } = require('node:test')
const assert = require('node:assert')
const Api = require('../src/api')
const { initTestKey, mockOctokit, bootstrap } = require('./helpers')

before(async () => {
  await initTestKey()
})

describe('bootstrap flow', () => {
  let mockCore

  beforeEach(() => {
    mockCore = {
      getInput: mock.fn(),
      setOutput: mock.fn(),
      setFailed: mock.fn()
    }
  })

  it('sets repository secret and outputs status', async () => {
    const api = new Api('token', 'owner/repo', false)
    mockOctokit(api, { status: 201, data: { message: 'created' } })

    await bootstrap(api, 'MY_SECRET', 'secret-value', mockCore)

    assert.strictEqual(mockCore.setFailed.mock.calls.length, 0)
    assert.strictEqual(mockCore.setOutput.mock.calls[0].arguments[1], 201)
  })

  it('sets org secret with visibility options', async () => {
    const api = new Api('token', 'my-org', true)
    mockCore.getInput = mock.fn((name) => {
      if (name === 'visibility') return 'selected'
      if (name === 'selected_repository_ids') return '123,456'
      return ''
    })
    const getData = mockOctokit(api, { status: 204, data: {} })

    await bootstrap(api, 'ORG_SECRET', 'value', mockCore)

    const data = getData()
    assert.strictEqual(data.visibility, 'selected')
    assert.strictEqual(data.selected_repository_ids, '123,456')
    assert.strictEqual(mockCore.setFailed.mock.calls.length, 0)
  })

  it('handles errors correctly', async () => {
    const api = new Api('token', 'owner/repo', false)

    // Test API exception
    api.octokit.request = mock.fn(async () => {
      throw new Error('API rate limit exceeded')
    })
    await assert.rejects(
      async () => bootstrap(api, 'MY_SECRET', 'value', mockCore),
      { message: 'API rate limit exceeded' }
    )
    assert.strictEqual(mockCore.setFailed.mock.calls[0].arguments[0], 'API rate limit exceeded')

    // Test HTTP error status
    mockCore.setFailed = mock.fn()
    mockOctokit(api, { status: 403, data: { message: 'Forbidden' } })
    await bootstrap(api, 'MY_SECRET', 'value', mockCore)
    assert.deepStrictEqual(mockCore.setFailed.mock.calls[0].arguments[0], { message: 'Forbidden' })
  })
})
