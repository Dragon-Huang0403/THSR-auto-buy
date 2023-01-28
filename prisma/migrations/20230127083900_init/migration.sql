-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "startStation" TEXT NOT NULL,
    "endStation" TEXT NOT NULL,
    "searchDate" DATETIME NOT NULL,
    "carType" INTEGER NOT NULL DEFAULT 0,
    "seatType" INTEGER NOT NULL DEFAULT 0,
    "adult" INTEGER NOT NULL,
    "child" INTEGER NOT NULL DEFAULT 0,
    "disabled" INTEGER NOT NULL DEFAULT 0,
    "elder" INTEGER NOT NULL DEFAULT 0,
    "college" INTEGER NOT NULL DEFAULT 0,
    "taiwanId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "trainNo" TEXT,
    "bookDate" DATETIME NOT NULL,
    "hasBook" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "TicketResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ticketId" TEXT,
    "errorMessage" TEXT,
    "reservationId" TEXT NOT NULL,
    CONSTRAINT "TicketResult_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "TicketResult_ticketId_key" ON "TicketResult"("ticketId");
