import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import Layout from '../../components/Layout';
import NoCookies from '../../components/NoCookies';
import AdminHeader from '@/components/AdminHeader';
import { Box, Text, GridItem, HStack } from '@chakra-ui/layout';
import { Heading } from '@chakra-ui/react';

const Participant = () => {
  const [participantId, setParticipantId] = useState();
  const [cookies, setCookies] = useCookies();
  const [partyId, setPartyId] = useState();
  const [jamId, setJamId] = useState();
  const [jamContent, setJamContent] = useState(); // Jam data to use. jamContent is currently redundant.
  const [jamIdWithVotes, setJamIdWithVotes] = useState(); // Data manipulation stage
  const [displayData, setDisplayData] = useState(); // Final data to display

  useEffect(() => {
    console.log('1');
    const id = cookies['jams-participant'];
    if (id) {
      setParticipantId(id);
      setPartyId(id);
    } else {
      settingIdCookies(); //TODO remove this
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies]);

  useEffect(() => {
    console.log('2');
    if (!partyId) {
      return;
    }
    loadParticipantJam(); // First data manipulation

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partyId]);

  useEffect(() => {
    console.log('3');
    if (!jamId) {
      return;
    }
    loadJamOnId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jamId]);

  const loadJamOnId = async () => {
    const response = await fetch(
      `/api/jam-id?jamId=${encodeURIComponent(jamId)}`,
    );
    const data = await response.json();
    setJamContent(data);
  };

  const loadParticipantJam = async () => {
    console.log('Entering loadParticipantJam()');
    let jamIdsVotes = [];

    await fetch(`/api/party-jam?participantId=${partyId}`)
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
          // jamIdsVotes = [{jamId: 'xyz$', votes: 3}, {jamId: 'abc&', votes: 1}]
          jamIdsVotes.push({ jamId: id, votes: votesAdded });
        });
      })
      .then(() => {
        console.log('jamIdWithVotes:');
        console.log(jamIdsVotes);
        setJamIdWithVotes(jamIdsVotes);
      })
      .then(() => {
        loadJamContent(jamIdsVotes);
      })
      .catch((error) =>
        console.error('Error loading participant', error),
      );
  };

  const loadJamContent = async (metaVotes) => {
    let jamMetaContent = [];

    Promise.all(
      metaVotes.map((item) => {
        fetch(`/api/jam-id?jamId=${encodeURIComponent(item.jamId)}`)
          .then((response) => response.json())
          .then((data) => {
            jamMetaContent.push({
              jamId: item.jamId,
              votes: item.votes,
              title: data.title,
              description: data.description,
            });
            // console.log(
            //   `jamId: ${item.jamId} | votes: ${item.votes} | title ${data.title} | description: ${data.description}`,
            // );
          });
      }),
    )
      .then(() => {
        console.log('Inside of THEN of loadJamContent()');
        setDisplayData(jamMetaContent); // Comment out to show data?? why??
        console.log('jamMetaContent:');
        console.log(jamMetaContent);
      })
      .catch((error) => console.log(error.message));

    // after this Promise.all resolves
    // .then( () => { ..callback function ..})

    // This is the part that isn't making sense.
    // setDisplayData(jamMetaContent);
    return;
  };

  const settingIdCookies = () => {
    fetch('/api/participant', {
      method: 'POST',
    })
      .then((response) => response.json())
      .then((participant) => {
        setCookies('jams-participant', participant.participantId);
      })
      .catch((error) =>
        console.error('Error saving participant: ', error),
      );
  };

  if (!participantId) return <NoCookies />;

  return (
    console.log('Entering the Render...'),
    console.log('displayData inside the Render:'),
    console.log(displayData),
    (
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

              <Text as="h5" fontWeight={600} pb={4} mt={10}>
                {displayData
                  ? displayData.map((item, index) => {
                      return (
                        <li key={index}>
                          Title: {item.title} | Votes: {item.votes}
                        </li>
                      );
                    })
                  : ''}
              </Text>

              {/* {displayData
                ? displayData.map((item, index) => {
                    <JamTitle
                      key={index}
                      title={item.title}
                      votingTotal={item.votes}
                    />;
                  })
                : ''} */}
            </GridItem>
          </Layout>
        </Box>
      </>
    )
  );
};

const JamTitle = ({ title, votingTotal }) => {
  return (
    <HStack borderRadius="lg" borderWidth="1px" p={4} spacing={600}>
      <Box>Jam: {title}</Box>
      <Box>{votingTotal} votes</Box>
    </HStack>
  );
};

export default Participant;
