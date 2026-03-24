import { getClient } from '@research-hub/api-client'

export async function getProjects() {
  const client = getClient()
  const result = await client.getList('projects')
  return result.items
}

export async function getDatasets() {
  const client = getClient()
  const result = await client.getList('datasets')
  return result.items
}

export async function getNotes() {
  const client = getClient()
  const result = await client.getList('notes')
  return result.items
}

export async function getPublications() {
  const client = getClient()
  const result = await client.getList('publications')
  return result.items
}

