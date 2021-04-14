import { get, post } from './axios'

export const postContribution = async (params) => post('', params)
export const postWithdraw = async (params) => post('', params)

export const getUserContributions = async (params) => get('', params)
export const getCommunityContributions = async (params) => get('', params)