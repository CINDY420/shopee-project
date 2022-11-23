import { allPhaseEnvs } from '@/common/constants/deployment'
/**
 * split envs to common envs and phase envs
 * frontend envs are uppercase, such as LIVE, TEST, UAT, FTE, PFB
 */
export const splitFEEnvsToCommonAndPhaseEnvs = (envs: string[]): { commonEnvs: string[]; phaseEnvs: string[] } => {
  const commonEnvs: string[] = []
  const phaseEnvs: string[] = []

  envs.forEach((env) => {
    const isPhaseEnv = allPhaseEnvs.includes(env)
    if (isPhaseEnv) {
      phaseEnvs.push(env)
    } else {
      commonEnvs.push(env)
    }
  })

  return { commonEnvs, phaseEnvs }
}
