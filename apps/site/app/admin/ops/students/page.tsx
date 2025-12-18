import { requireAdmin } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { StudentsTable } from "@/components/admin/StudentsTable";

interface SearchParams {
  role?: string;
  cohort?: string;
  status?: string;
  search?: string;
  page?: string;
}

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireAdmin();

  const page = parseInt(searchParams.page || "1");
  const limit = 50;
  const skip = (page - 1) * limit;

  // Build filter
  const where: any = {};
  
  if (searchParams.role) {
    where.role = searchParams.role;
  }
  
  if (searchParams.cohort) {
    where.cohortId = searchParams.cohort;
  }
  
  if (searchParams.search) {
    where.OR = [
      { email: { contains: searchParams.search, mode: "insensitive" } },
      { name: { contains: searchParams.search, mode: "insensitive" } },
    ];
  }

  const [students, total, cohorts] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        cohort: true,
        enrollments: {
          where: { status: "active" },
          include: {
            payment: true,
          },
        },
        studentProfile: true,
        _count: {
          select: {
            payments: true,
            assignments: true,
          },
        },
      },
    }),
    prisma.user.count({ where }),
    prisma.cohort.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
          <p className="mt-2 text-gray-600">
            Manage student accounts, enrollments, and progress
          </p>
        </div>
        <a
          href="/admin/ops/students/export"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Export Data
        </a>
      </div>

      <StudentsTable 
        students={students}
        cohorts={cohorts}
        total={total}
        page={page}
        limit={limit}
        filters={searchParams}
      />
    </div>
  );
}
import { prisma } from "@/lib/prisma";
import { StudentsTable } from "@/components/admin/StudentsTable";

interface SearchParams {
  role?: string;
  cohort?: string;
  status?: string;
  search?: string;
  page?: string;
}

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireAdmin();

  const page = parseInt(searchParams.page || "1");
  const limit = 50;
  const skip = (page - 1) * limit;

  // Build filter
  const where: any = {};
  
  if (searchParams.role) {
    where.role = searchParams.role;
  }
  
  if (searchParams.cohort) {
    where.cohortId = searchParams.cohort;
  }
  
  if (searchParams.search) {
    where.OR = [
      { email: { contains: searchParams.search, mode: "insensitive" } },
      { name: { contains: searchParams.search, mode: "insensitive" } },
    ];
  }

  const [students, total, cohorts] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        cohort: true,
        enrollments: {
          where: { status: "active" },
          include: {
            payment: true,
          },
        },
        studentProfile: true,
        _count: {
          select: {
            payments: true,
            assignments: true,
          },
        },
      },
    }),
    prisma.user.count({ where }),
    prisma.cohort.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
          <p className="mt-2 text-gray-600">
            Manage student accounts, enrollments, and progress
          </p>
        </div>
        <a
          href="/admin/ops/students/export"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Export Data
        </a>
      </div>

      <StudentsTable 
        students={students}
        cohorts={cohorts}
        total={total}
        page={page}
        limit={limit}
        filters={searchParams}
      />
    </div>
  );
}


