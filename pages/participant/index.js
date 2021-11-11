import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Box, Text, GridItem } from '@chakra-ui/layout';
import Layout from '../../components/Layout';

const Participant = () => {
  const [participantId, setParticipantId] = useState();
  const [cookies, setCookies] = useCookies();
  const [partyId, setPartyId] = useState('9FUN3xF3hRMJc9r8KoSj');
  const [titles, setTitles] = useState([]);
  const [jams, setJams] = useState([]);
  const [jamId, setJamId] = useState('AdaCMpU5JPYuSs8k9Yl3');

  useEffect(() => {
    loadParticipantJam();
  }, []);

  useEffect(() => {
    loadJams();
  }, []);

  useEffect(() => {
    loadJamOnId();
  }, []);

  useEffect(() => {
    const id = cookies['jams-participant'];
    if (id) {
      console.log(`id: ${id}`);
      setParticipantId(id);
    } else {
      settingIdCookies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies]);

  // TODO get jam based on jamId
  const loadJamOnId = async () => {
    const response = await fetch(
      `/api/party-jam?${encodeURIComponent(jamId)}`,
    );
    const data = (await response).json();

    console.log(data);
  };

  const loadParticipantJam = async () => {
    const response = await fetch(`/api/party-jam?partyId=${partyId}`);
    const data = await response.json();

    console.log(data);
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

  const loadJams = async () => {
    await fetch('/api/jamming')
      .then((response) => response.json())
      .then((jam) => {
        setJams(jam);
        jam.map((item) => {
          setTitles((title) => [...title, item.name]);
        });
      });
  };

  return (
    <Box>
      <Head>
        <title>Participant</title>
      </Head>
      <Layout py={14}>
        <GridItem colSpan={6}>
          <Text as="h5" fontWeight={600} pb={4}>
            User ID (Participant ID):
            {participantId ? participantId : ''}
          </Text>
          <Text as="h5" fontWeight={600} pb={4}>
            {titles.map((title, index) => (
              <li key={index}>{title}</li>
            ))}
          </Text>
        </GridItem>
      </Layout>
    </Box>
  );
};

export default Participant;
