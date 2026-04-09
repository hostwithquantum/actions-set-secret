import { describe, it, before } from 'node:test'
import assert from 'node:assert'
import Api from '../src/api.js'
import { initTestKey, getTestPublicKey } from './helpers.js'

before(async () => {
  await initTestKey()
})

describe('Api', () => {

  it('configures correctly for repository', () => {
    const api = new Api('token', 'owner/repo')
    assert.strictEqual(api._repo, 'owner/repo')
    assert.strictEqual(api._base, 'repos')
    assert.strictEqual(api.isOrg(), false)
  })

  it('configures correctly for organization', () => {
    const api = new Api('token', 'my-org', true)
    assert.strictEqual(api._repo, 'my-org')
    assert.strictEqual(api._base, 'orgs')
    assert.strictEqual(api.isOrg(), true)
  })

  it('encrypts secret with correct structure', async () => {
    const api = new Api('token', 'owner/repo')
    const result = await api.createSecret('key-123', getTestPublicKey(), 'MY_SECRET', 'secret-value')

    assert.strictEqual(result.key_id, 'key-123')
    assert.strictEqual(typeof result.encrypted_value, 'string')
    const decoded = Buffer.from(result.encrypted_value, 'base64')
    assert.ok(decoded.length > 0)
  })

  it('calls correct API endpoints for repository', async () => {
    const api = new Api('token', 'owner/repo', false)
    const calls = []

    api.octokit.request = async (endpoint, params) => {
      calls.push({ endpoint, params })
      if (endpoint.includes('public-key')) {
        return { data: { key_id: 'abc', key: 'xyz' } }
      }
      return { status: 201, data: {} }
    }

    const pubKey = await api.getPublicKey()
    assert.deepStrictEqual(pubKey, { key_id: 'abc', key: 'xyz' })
    assert.strictEqual(calls[0].params.base, 'repos')

    await api.setSecret({ encrypted_value: 'enc', key_id: 'abc' }, 'MY_SECRET')
    assert.strictEqual(calls[1].params.base, 'repos')
    assert.strictEqual(calls[1].params.name, 'MY_SECRET')
  })

  it('calls correct API endpoints for organization', async () => {
    const api = new Api('token', 'my-org', true)
    const calls = []

    api.octokit.request = async (endpoint, params) => {
      calls.push({ endpoint, params })
      if (endpoint.includes('public-key')) {
        return { data: { key_id: 'abc', key: 'xyz' } }
      }
      return { status: 201, data: {} }
    }

    await api.getPublicKey()
    assert.strictEqual(calls[0].params.base, 'orgs')

    await api.setSecret({ encrypted_value: 'enc', key_id: 'abc' }, 'ORG_SECRET')
    assert.strictEqual(calls[1].params.base, 'orgs')
  })
})
