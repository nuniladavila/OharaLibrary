import React, { useEffect, useState } from 'react';
import { Statistic, Header, Segment, Icon, Card, Grid } from 'semantic-ui-react';
import { COLORS } from '../constants';

export default function AdminDashboardPane({ books }) {
  const [categoryCounts, setCategoryCounts] = useState({});
  const [shelfLocationCounts, setShelfLocationCounts] = useState({});

  useEffect(() => {
    const catCounts = {};
    const shelfCounts = {};
    books.forEach(book => {
      // Category count
      if (typeof book.Category === 'string' && book.Category.trim()) {
        catCounts[book.Category] = (catCounts[book.Category] || 0) + 1;
      }
      // Shelf location count
      if (typeof book.ShelfLocation === 'string' && book.ShelfLocation.trim()) {
        shelfCounts[book.ShelfLocation] = (shelfCounts[book.ShelfLocation] || 0) + 1;
      }
    });
    setCategoryCounts(catCounts);
    setShelfLocationCounts(shelfCounts);
  }, [books]);

  return (
  <Segment basic style={{ padding: '3rem', background: COLORS.background }}>
  <Header as='h1' style={{ marginBottom: '0', fontWeight: 'bolder', color: COLORS.darkerAccent, fontSize: '3rem' }}>
        Ohara Library Dashboard
      </Header>
  <Header as='h3' style={{ marginTop: '0', fontWeight: 400, color: COLORS.subtitle }}>
        {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </Header>

      {/* Card Row */}
      <Grid columns={4} stackable doubling style={{ marginBottom: '2.5rem' }}>
        <Grid.Row>
          <Grid.Column>
            <Card fluid centered style={{ borderRadius: 18, boxShadow: 'rgba(255, 112, 67, 0.133) 0px 2px 12px', padding: '2rem', background: 'white' }}>
              <Card.Content textAlign='center'>
                <Card.Header style={{ fontSize: 36, color: COLORS.accentColor, fontWeight: 700 }}> {books.length} </Card.Header>
                <Card.Meta style={{ fontSize: 18, color: COLORS.subtitle, fontWeight: 500 }}>Total Books</Card.Meta>
                <Icon name="book" size="big" style={{ color: COLORS.accentColor, background: COLORS.background, borderRadius: '50%', padding: 12, marginTop: 12 }} />
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column>
            <Card fluid centered style={{ borderRadius: 18, boxShadow: 'rgba(255, 112, 67, 0.133) 0px 2px 12px', padding: '2rem', background: 'white' }}>
              <Card.Content textAlign='center'>
                <Card.Header style={{ fontSize: 36, color: COLORS.accentColor, fontWeight: 700 }}>{categoryCounts["Fiction"] || 0}</Card.Header>
                <Card.Meta style={{ fontSize: 18, color: COLORS.subtitle, fontWeight: 500 }}>Fiction Books</Card.Meta>
                <Icon name="fly" size="big" style={{ color: COLORS.accentColor, background: COLORS.background, borderRadius: '50%', padding: 12, marginTop: 12 }} />
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column>
            <Card fluid centered style={{ borderRadius: 18, boxShadow: 'rgba(255, 112, 67, 0.133) 0px 2px 12px', padding: '2rem', background: 'white' }}>
              <Card.Content textAlign='center'>
                <Card.Header style={{ fontSize: 36, color: COLORS.accentColor, fontWeight: 700 }}>{categoryCounts["Non-Fiction"] || 0}</Card.Header>
                <Card.Meta style={{ fontSize: 18, color: COLORS.subtitle, fontWeight: 500 }}>Non-Fiction Books</Card.Meta>
                <Icon name="lab" size="big" style={{ color: COLORS.accentColor, background: COLORS.background, borderRadius: '50%', padding: 12, marginTop: 12 }} />
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column>
            <Card fluid centered style={{ borderRadius: 18, boxShadow: 'rgba(255, 112, 67, 0.133) 0px 2px 12px', padding: '2rem', background: 'white' }}>
              <Card.Content textAlign='center'>
                <Card.Header style={{ fontSize: 36, color: COLORS.accentColor, fontWeight: 700 }}>42</Card.Header>
                <Card.Meta style={{ fontSize: 18, color: COLORS.subtitle, fontWeight: 500 }}>Borrowed Books</Card.Meta>
                <Icon name="handshake" size="big" style={{ color: COLORS.accentColor, background: COLORS.background, borderRadius: '50%', padding: 12, marginTop: 12 }} />
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <Statistic.Group>
        {Object.entries(shelfLocationCounts).map(([shelfLoc, count]) => (
          <Statistic key={shelfLoc}>
            <Statistic.Value style={{ color: COLORS.accentColor }}>{count}</Statistic.Value>
            <Statistic.Label style={{ color: COLORS.subtitle }}>{shelfLoc} Books</Statistic.Label>
          </Statistic>
        ))}
      </Statistic.Group>
    </Segment>
  );
}

