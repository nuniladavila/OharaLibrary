import React, { useEffect, useState } from 'react';
import { Statistic, Header, Segment, Icon, Card, Grid } from 'semantic-ui-react';

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
    <Segment basic style={{ padding: '3rem' }}>
      <Header as='h1' color='violet' style={{ marginBottom: '0', fontWeight: 400 }}>
        Ohara Library Dashboard
      </Header>
      <Header as='h3' color='grey' style={{ marginTop: '0', fontWeight: 400 }}>
        {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </Header>

      {/* Card Row */}
      <Grid columns={4} stackable doubling style={{ marginBottom: '2.5rem' }}>
        <Grid.Row>
          <Grid.Column>
            <Card fluid centered style={{ borderRadius: 18, boxShadow: '0 2px 12px #a084ca22', padding: '2rem' }}>
              <Card.Content textAlign='center'>
                <Card.Header style={{ fontSize: 36, color: '#a084ca', fontWeight: 700 }}> {books.length} </Card.Header>
                <Card.Meta style={{ fontSize: 18, color: '#a084ca', fontWeight: 500 }}>Total Books</Card.Meta>
                <Icon name="book" size="big" style={{ color: '#e57373', background: '#f3e8ff', borderRadius: '50%', padding: 12, marginTop: 12 }} />
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column>
            <Card fluid centered style={{ borderRadius: 18, boxShadow: '0 2px 12px #a084ca22', padding: '2rem' }}>
              <Card.Content textAlign='center'>
                <Card.Header style={{ fontSize: 36, color: '#a084ca', fontWeight: 700 }}>{categoryCounts["Fiction"] || 0}</Card.Header>
                <Card.Meta style={{ fontSize: 18, color: '#a084ca', fontWeight: 500 }}>Fiction Books</Card.Meta>
                <Icon name="fly" size="big" style={{ color: '#e57373', background: '#f3e8ff', borderRadius: '50%', padding: 12, marginTop: 12 }} />
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column>
            <Card fluid centered style={{ borderRadius: 18, boxShadow: '0 2px 12px #a084ca22', padding: '2rem' }}>
              <Card.Content textAlign='center'>
                <Card.Header style={{ fontSize: 36, color: '#a084ca', fontWeight: 700 }}>{categoryCounts["Non-Fiction"] || 0}</Card.Header>
                <Card.Meta style={{ fontSize: 18, color: '#a084ca', fontWeight: 500 }}>Non-Fiction Books</Card.Meta>
                <Icon name="lab" size="big" style={{ color: '#e57373', background: '#f3e8ff', borderRadius: '50%', padding: 12, marginTop: 12 }} />
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column>
            <Card fluid centered style={{ borderRadius: 18, boxShadow: '0 2px 12px #a084ca22', padding: '2rem' }}>
              <Card.Content textAlign='center'>
                <Card.Header style={{ fontSize: 36, color: '#a084ca', fontWeight: 700 }}>42</Card.Header>
                <Card.Meta style={{ fontSize: 18, color: '#a084ca', fontWeight: 500 }}>Borrowed Books</Card.Meta>
                <Icon name="handshake" size="big" style={{ color: '#e57373', background: '#f3e8ff', borderRadius: '50%', padding: 12, marginTop: 12 }} />
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <Statistic.Group>
        {Object.entries(shelfLocationCounts).map(([shelfLoc, count]) => (
          <Statistic key={shelfLoc}>
            <Statistic.Value>{count}</Statistic.Value>
            <Statistic.Label>{shelfLoc} Books</Statistic.Label>
          </Statistic>
        ))}
      </Statistic.Group>
    </Segment>
  );
}

