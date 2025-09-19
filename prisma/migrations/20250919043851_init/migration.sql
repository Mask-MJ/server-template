-- CreateTable
CREATE TABLE "Assistant" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "model_name" TEXT NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "top_p" DOUBLE PRECISION NOT NULL DEFAULT 0.3,
    "presence_penalty" DOUBLE PRECISION NOT NULL DEFAULT 0.4,
    "similarity_threshold" DOUBLE PRECISION NOT NULL DEFAULT 0.2,
    "keywords_similarity_weight" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
    "top_n" INTEGER NOT NULL DEFAULT 6,
    "top_k" INTEGER NOT NULL DEFAULT 1024,
    "empty_response" TEXT,
    "opener" TEXT,
    "prompt" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Assistant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AssistantToKnowledgeBase" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AssistantToKnowledgeBase_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AssistantToKnowledgeBase_B_index" ON "_AssistantToKnowledgeBase"("B");

-- AddForeignKey
ALTER TABLE "Assistant" ADD CONSTRAINT "Assistant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssistantToKnowledgeBase" ADD CONSTRAINT "_AssistantToKnowledgeBase_A_fkey" FOREIGN KEY ("A") REFERENCES "Assistant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssistantToKnowledgeBase" ADD CONSTRAINT "_AssistantToKnowledgeBase_B_fkey" FOREIGN KEY ("B") REFERENCES "KnowledgeBase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
