import {
  Box,
  Heading,
  Spacer,
  Text,
  Flex,
  Stack,
  Tag,
  Link,
} from '@chakra-ui/react';

const overviewCard = ({
  isOpen,
  jamName,
  createdAt,
  openFor,
  jamUrl,
}) => {
  return (
    <Box
      bg="white"
      rounded={'md'}
      p="20px"
      m="5px"
      overflow={'hidden'}
      border="1px"
      borderColor="#8D8D8D"
    >
      <Flex direction="column" align="flex-start" minH="120px">
        <Link href={`moderator/${jamUrl}`}>
          <Heading as="h4" fontSize="lg" mb={2}>
            {jamName}
          </Heading>
        </Link>
        <Tag
          color={isOpen ? '#00681D' : '#535353'}
          border="1px"
          borderColor={isOpen ? '#00681D' : '#8D8D8D'}
          rounded="16px"
          size="sm"
          bg={isOpen ? '#EEFFF3' : '#F5F5F5'}
        >
          {isOpen ? 'Open' : 'Closed'}
        </Tag>
        <Spacer />
        <Stack direction={'column'} spacing={0} fontSize={'sm'}>
          <Text color="#535353" fontSize="12px">
            Open for {openFor}
          </Text>
          <Text color="#535353" fontSize="12px">
            Created: {createdAt}
          </Text>
        </Stack>
      </Flex>
    </Box>
  );
};

export default overviewCard;
