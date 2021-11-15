import AdminHeader from '@/components/AdminHeader';
import Layout from '@/components/Layout';
import { Box, Text, GridItem } from '@chakra-ui/layout';

const NoCookies = () => {
  return (
    <>
      <AdminHeader />
      <Box>
        <Layout>
          <GridItem colSpan={{ sm: 1, md: 6 }}>
            <Text as="h5" fontWeight={600} pb={4} pt={20}>
              No Cookies Set
            </Text>
          </GridItem>
        </Layout>
      </Box>
    </>
  );
};

export default NoCookies;
