import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const hseTemplates = [
    {
      name: 'Risk Assessment',
      type: 'hse',
      content: 'Generate HSE Risk Assessment document. Structured: Title, Scope, Hazards Identification, Risk Levels (High/Medium/Low), Control Measures, Residual Risk, PPE Requirements, Responsibilities, Emergency Response. Use details: {details}. Output as structured markdown with tables.',
      isPremium: false
    },
    {
      name: 'Method Statement',
      type: 'hse',
      content: 'Generate HSE Method Statement. Sections: Project Info, Sequence of Work, Resources, Hazards & Controls, Emergency Procedures, Signatures. Professional format. Details: {details}',
      isPremium: true
    },
    {
      name: 'Safety Policy',
      type: 'hse',
      content: 'Generate HSE Safety Policy document. Include commitment, objectives, responsibilities, arrangements. Company details from {details}. Formal tone.',
      isPremium: false
    },
    {
      name: 'Incident Report',
      type: 'hse',
      content: 'Generate HSE Incident Report form. Details: incident date/location, description, injuries, witnesses, root cause, corrective actions. From {details}.',
      isPremium: false
    },
    {
      name: 'Toolbox Talk',
      type: 'hse',
      content: 'Generate HSE Toolbox Talk sheet. Topic, hazards, controls, sign-off. Customize with {details}.',
      isPremium: false
    },
    {
      name: 'HSE Plan',
      type: 'hse',
      content: 'Generate comprehensive HSE Plan. Sections: policy, organization, arrangements, monitoring. Full project HSE plan from {details}.',
      isPremium: true
    },
    // Modern/Classic variants
    {
      name: 'Modern Risk Assessment',
      type: 'hse',
      content: 'Modern clean Risk Assessment template. Use tables, bullet points. {details}',
      isPremium: true
    }
  ]

  for (const template of hseTemplates) {
    await prisma.template.upsert({
      where: {
        name_type: {
          name: template.name,
          type: template.type,
        },
      },
      update: {},
      create: template,
    })
    console.log(`Created template: ${template.name}`)
  }
  console.log('HSE templates seeded!')
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())

