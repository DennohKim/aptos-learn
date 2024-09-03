import { InputTransactionData } from '@aptos-labs/wallet-adapter-react'
import { MODULE_ADDRESS } from '@/constants/constants'

export type MintCourseCompletionNFTArguments = {
  courseId: string;
  courseName: string;
  userEmail: string;
};

export const mintCourseCompletionNFT = (args: MintCourseCompletionNFTArguments): InputTransactionData => {
  const { courseId, courseName, userEmail } = args

  return {
    data: {
      function: `${MODULE_ADDRESS}::course_completion_nft::mint_nft`,
      typeArguments: [],
      functionArguments: [courseId, courseName, userEmail],
    },
  }
}
