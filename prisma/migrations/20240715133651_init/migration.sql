-- CreateTable
CREATE TABLE "assemblies" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "pregnant" TEXT NOT NULL,
    "note" TEXT,
    "members" JSONB NOT NULL,

    CONSTRAINT "assemblies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members" (
    "id" SERIAL NOT NULL,
    "fullname" TEXT NOT NULL,
    "pregnantTimes" INTEGER NOT NULL DEFAULT 0,
    "associated" TEXT NOT NULL,
    "activeReprimands" INTEGER NOT NULL DEFAULT 0,
    "totalReprimands" INTEGER NOT NULL DEFAULT 0,
    "activeAbsences" INTEGER NOT NULL DEFAULT 0,
    "totalAbsences" INTEGER NOT NULL DEFAULT 0,
    "foodDebt" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reprimands" (
    "id" SERIAL NOT NULL,
    "fullname" TEXT NOT NULL,
    "note" TEXT NOT NULL,

    CONSTRAINT "reprimands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "laws" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "laws_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "assemblies_date_key" ON "assemblies"("date");
