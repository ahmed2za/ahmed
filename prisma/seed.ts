import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // تنظيف البيانات القديمة
    await prisma.review.deleteMany();
    await prisma.company.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany({
      where: { email: 'admin@misdaqia.com' }
    });

    // إنشاء الفئات الأساسية
    const categories = await prisma.category.createMany({
      data: [
        {
          name: 'تقنية المعلومات',
          description: 'شركات وخدمات تكنولوجيا المعلومات والبرمجيات',
        },
        {
          name: 'التسويق الرقمي',
          description: 'خدمات التسويق الرقمي ووسائل التواصل الاجتماعي',
        },
        {
          name: 'التصميم',
          description: 'خدمات التصميم الجرافيكي وتصميم المواقع',
        },
        {
          name: 'الاستشارات',
          description: 'خدمات الاستشارات الإدارية والمالية',
        },
        {
          name: 'العقارات',
          description: 'خدمات العقارات والإسكان',
        },
      ],
      skipDuplicates: true,
    });

    // إنشاء مستخدم إداري (بدون كلمة مرور)
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@misdaqia.com' },
      update: {},
      create: {
        email: 'admin@misdaqia.com',
        name: 'Admin',
        role: 'ADMIN',
        status: 'ACTIVE'
      },
    });

    // إنشاء شركات تجريبية
    const techCategory = await prisma.category.findFirst({
      where: { name: 'تقنية المعلومات' }
    });

    const marketingCategory = await prisma.category.findFirst({
      where: { name: 'التسويق الرقمي' }
    });

    if (techCategory && marketingCategory) {
      const companies = await prisma.company.createMany({
        data: [
          {
            name: 'شركة التقنية المتقدمة',
            description: 'شركة رائدة في مجال تطوير البرمجيات',
            website: 'https://techcompany.com',
            categoryId: techCategory.id,
            featured: true
          },
          {
            name: 'وكالة التسويق الإبداعي',
            description: 'وكالة متخصصة في التسويق الرقمي',
            website: 'https://marketingagency.com',
            categoryId: marketingCategory.id,
            featured: true
          }
        ],
        skipDuplicates: true
      });

      // إنشاء مراجعات تجريبية
      if (companies) {
        const firstCompany = await prisma.company.findFirst();
        if (firstCompany) {
          await prisma.review.create({
            data: {
              title: 'تجربة ممتازة',
              content: 'خدمة احترافية وفعالة',
              rating: 5,
              userId: adminUser.id,
              companyId: firstCompany.id
            }
          });
        }
      }
    }

    console.log('تم إنشاء البيانات بنجاح:');
    console.log(`- ${categories.count} فئة`);
    console.log(`- 1 مستخدم إداري`);
    console.log(`- 2 شركة`);
    console.log(`- 1 مراجعة`);

  } catch (error) {
    console.error('حدث خطأ أثناء إنشاء البيانات:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
