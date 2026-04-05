import { PrismaClient } from '@/lib/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding started')
  
  const templatesData = [
    // HSE Templates
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
    {
      name: 'Modern Risk Assessment',
      type: 'hse',
      content: 'Modern clean Risk Assessment template. Use tables, bullet points. {details}',
      isPremium: true
    },
    // Resume Templates
    {
      name: 'Modern Resume',
      type: 'resume',
      content: 'Generate modern one-page resume HTML. Professional layout with sidebar. Sections: Contact, Summary, Experience, Education, Skills. Use Tailwind CSS classes. Input details: {details}. Output complete HTML ready for PDF conversion.',
      isPremium: false
    },
    {
      name: 'Classic Resume',
      type: 'resume',
      content: 'Generate classic two-column resume HTML. Traditional ATS-friendly format. Sections: Header, Summary, Experience, Education, Skills, Certifications. Tailwind CSS. Details: {details}',
      isPremium: false
    },
    {
      name: 'Tech Resume',
      type: 'resume',
      content: 'Tech-focused resume HTML. Highlight projects, GitHub, tech stack prominently. Modern design with code syntax colors. Details: {details}',
      isPremium: true
    },
    {
      name: 'Executive Resume',
      type: 'resume',
      content: 'Executive-level resume HTML. Emphasis on leadership, achievements, metrics. Clean sophisticated design. Details: {details}',
      isPremium: true
    },
    {
      name: 'Creative Resume',
      type: 'resume',
      content: 'Creative portfolio-style resume HTML. Colorful, visual timeline format. Perfect for design/marketing. Details: {details}',
      isPremium: true
    },
    {
      name: 'Entry Level Resume',
      type: 'resume',
      content: 'Entry-level resume HTML. Focus on education, projects, internships. Simple clean format. Details: {details}',
      isPremium: false
    },
    // Cover Letter Templates
    {
      name: 'Standard Cover Letter',
      type: 'cover',
      content: 'Generate professional cover letter. Structure: Header, Salutation, Intro paragraph, 2-3 body paragraphs, Call to action, Sign-off. Tailor to position/company. Details: {details}',
      isPremium: false
    },
    {
      name: 'Tech Cover Letter',
      type: 'cover',
      content: 'Technical cover letter highlighting coding skills, projects, tech stack. Enthusiastic tone for engineering roles. Details: {details}',
      isPremium: true
    },
    {
      name: 'Executive Cover Letter',
      type: 'cover',
      content: 'Executive cover letter focusing on leadership, business impact, strategic vision. Sophisticated tone. Details: {details}',
      isPremium: true
    },
    {
      name: 'Creative Cover Letter',
      type: 'cover',
      content: 'Creative cover letter with personality/storytelling. Perfect for design/marketing roles. Details: {details}',
      isPremium: true
    }
  ]

  // Delete existing templates to avoid duplicates
  await prisma.template.deleteMany()
  

  // Create all templates
  await prisma.template.createMany({
    data: templatesData
  })

// Create admin user
  const adminEmail = 'info@sartrends.store'
  const adminPassword = 'Aliraza00721@'
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (!existingAdmin) {
    const hashedPassword = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZSA24GmLdmwvfUu5jS5KK1TVBzf46' // hashed Aliraza00721@
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Sartrends Admin',
        hashed_password: hashedPassword,
        isAdmin: true,
        credits: 9999,
        isPaid: true,
        plan: 'enterprise'
      }
    })
    console.log(`Admin user created: ${adminEmail} (password: ${adminPassword})`)
  } else {
    console.log(`Admin user already exists: ${adminEmail}`)
  }


  console.log(`Seeding completed. Added ${templatesData.length} templates.`)

}

main()
  .catch((e) => {
    console.error('Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

