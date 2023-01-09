-- CreateTable
CREATE TABLE "TicketsByDate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "selectStartStation" TEXT NOT NULL,
    "selectDestinationStation" TEXT NOT NULL,
    "toTimeInputField" DATETIME NOT NULL,
    "trainRadioGroup" INTEGER NOT NULL,
    "seatRadioGroup" INTEGER NOT NULL,
    "typesoftrip" INTEGER NOT NULL,
    "adultTicketValue" INTEGER NOT NULL,
    "childTicketValue" INTEGER NOT NULL,
    "disabledTicketValue" INTEGER NOT NULL,
    "elderTicketValue" INTEGER NOT NULL,
    "collegeTicketValue" INTEGER NOT NULL,
    "dummyId" TEXT NOT NULL,
    "dummyPhone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "buyNthTrainItem" INTEGER,
    "toTrainIDInputField" TEXT,
    "toTimeTable" TEXT
);

-- CreateTable
CREATE TABLE "TicketResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ticketId" TEXT,
    "errorMessage" TEXT,
    "ticketsByDateId" TEXT NOT NULL,
    CONSTRAINT "TicketResult_ticketsByDateId_fkey" FOREIGN KEY ("ticketsByDateId") REFERENCES "TicketsByDate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "TicketResult_ticketId_key" ON "TicketResult"("ticketId");
