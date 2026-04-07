import { prisma } from '../lib/db';
import { FeatureFlags } from '@/lib/prisma';

async function seedFeatureFlags() {
  const flags: Array<{key: string, value: boolean}> = [
    { key: 'ai_chat', value: true },
    { key: 'billing_page', value: true },
    { key: 'whatsapp_button', value: true },
    { key: 'admin_panel_sections', value: true },
  ];

  for (const flag of flags) {
    const existing = await prisma.featureFlags.findUnique({ where: { key: flag.key } });
    if (!existing) {
      await prisma.featureFlags.create({
        data: flag,
      });
      console.log(`Created flag: ${flag.key} = ${flag.value}`);
    } else {
      console.log(`Flag ${flag.key} already exists`);
    }
  }
}

async function seedAIConfig() {
  const existing = await prisma.aIConfig.findFirst();
  if (!existing) {
    await prisma.aIConfig.create({
      data: {
        provider: 'openai',
        languageMode: 'auto',
      },
    });
    console.log('Created default AIConfig');
  }
}

seedFeatureFlags().then(() => {
  console.log('Feature flags seeded');
  process.exit(0);
}).catch(console.error);


