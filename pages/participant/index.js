import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import Layout from '../../components/Layout';
import NoCookies from '../../components/NoCookies';
import AdminHeader from '@/components/AdminHeader';
import { Box, GridItem, Flex, Spacer } from '@chakra-ui/layout';
import { Heading } from '@chakra-ui/react';

const Participant = () => {
  const [participantId, setParticipantId] = useState();
  const [cookies, setCookies] = useCookies();
  const [jamIdWithVotes, setJamIdWithVotes] = useState([]); // Data manipulation stage
  const [displayData, setDisplayData] = useState(); // Final data to display

  useEffect(() => {
    const id = cookies['jams-participant'];
    if (id) {
      setParticipantId(id);
    } else {
      // Setting cookie id has been removed.
      // Assuming cookie is present.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies]);

  useEffect(() => {
    if (!participantId) {
      return;
    }
    loadParticipantJam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participantId]);

  const loadParticipantJam = async () => {
    await fetch(`/api/party-jam?participantId=${participantId}`)
      .then((response) => response.json())
      .then((data) => {
        let uniqueJamIds = [];
        data.forEach((item) => {
          if (uniqueJamIds.includes(item.jamId) === false) {
            uniqueJamIds.push(item.jamId);
          }
        });

        uniqueJamIds.forEach((id) => {
          // this should return a list of votes for an jamId
          // e.g.[ 1, 1, 1]
          let allVotes = data.filter((item) => {
            return item.jamId === id;
          });

          // take the newly filtered array and total up the votes
          let voteTemp = [];
          allVotes.forEach((item) => {
            voteTemp = [item.vote, ...voteTemp];
          });

          let votesAdded = voteTemp.reduce((x, y) => {
            return x + y;
          });

          // add it to collection of jamIds and votes
          // [{jamId: 'xyz$', votes: 3}, {jamId: 'abc&', votes: 1}]
          jamIdWithVotes.push({ jamId: id, votes: votesAdded });
        });
      })
      .then(() => {
        setJamIdWithVotes(jamIdWithVotes);
      })
      .then(() => {
        loadJamContent(jamIdWithVotes);
      })
      .catch((error) =>
        console.error('Error loading participant', error),
      );
  };

  const loadJamContent = async (metaVotes) => {
    let jamMetaContent = [];

    Promise.all(
      metaVotes.map((item) => {
        return fetch(
          `/api/jam-id?jamId=${encodeURIComponent(item.jamId)}`,
        )
          .then((response) => response.json())
          .then((data) => {
            jamMetaContent.push({
              jamId: item.jamId,
              votes: item.votes,
              title: data.title,
              description: data.description,
            });
          });
      }),
    )
      .then(() => {
        setDisplayData(jamMetaContent);
      })
      .catch((error) => console.log('Error retrieving data:', error));
  };

  if (!participantId) return <NoCookies />;

  return (
    <>
      <AdminHeader />

      <Box>
        <Layout>
          <GridItem colSpan={{ sm: 1, md: 6 }}>
            <Heading as="h5" fontSize="lg" mb={1} mt={10}>
              User ID:
              {participantId ? participantId : ''}
            </Heading>

            <Box as={'main'} align={'left'} mt={10}>
              <Heading as="h3" fontSize="lg" mb={1}>
                Jams
              </Heading>
            </Box>

            {displayData
              ? displayData.map((item, index) => {
                  return (
                    <JamTitle
                      key={index}
                      title={item.title}
                      votingTotal={item.votes}
                    />
                  );
                })
              : ''}
          </GridItem>
        </Layout>
      </Box>
    </>
  );
};

const JamTitle = ({ title, votingTotal }) => {
  return (
    <Flex borderRadius="lg" borderWidth="2px" p={4} mt={4}>
      <Box>Jam: {title}</Box>
      <Spacer />
      <Box>{votingTotal} votes</Box>
    </Flex>
  );
};

export default Participant;
