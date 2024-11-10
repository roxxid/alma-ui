import { createServer, Model } from "miragejs"

type Lead = {
  name: string;
  submitted: string;
  status: string;
  country: string;
};

createServer({
  models: {
    lead: Model,
  },
  seeds(server) {
    server.db.loadData({
      leads: [
        {
          "id": "001",
          "name": "Jorge Ruiz",
          "submitted": "02/02/2024 2:45 PM",
          "status": "Pending",
          "country": "Mexico"
        },
        {
          "id": "002",
          "name": "Bahar Zamir",
          "submitted": "02/02/2024 2:45 PM",
          "status": "Pending",
          "country": "Mexico"
        },
        {
          "id": "003",
          "name": "Mary Lopez",
          "submitted": "02/02/2024 2:45 PM",
          "status": "Pending",
          "country": "Brazil"
        },
        {
          "id": "004",
          "name": "Li Zijin",
          "submitted": "02/02/2024 2:45 PM",
          "status": "Pending",
          "country": "South Korea"
        },
        {
          "id": "005",
          "name": "Mark Antonov",
          "submitted": "02/02/2024 2:45 PM",
          "status": "Pending",
          "country": "Russia"
        },
        {
          "id": "006",
          "name": "Jane Ma",
          "submitted": "02/02/2024 2:45 PM",
          "status": "Pending",
          "country": "Mexico"
        },
        {
          "id": "007",
          "name": "Anand Jain",
          "submitted": "02/02/2024 2:45 PM",
          "status": "Reached Out",
          "country": "Mexico"
        },
        {
          "id": "008",
          "name": "Anna Voronova",
          "submitted": "02/02/2024 2:45 PM",
          "status": "Pending",
          "country": "France"
        }
      ],
    })
  },
  routes() {
    this.get("/api/leads", (schema, request) => {
      return schema.db.leads
    }, { timing: 1000 });

    this.patch('/api/leads/:id', (schema, request) => {
      let id = request.params.id;
      let attrs = JSON.parse(request.requestBody);
      const now = new Date();
      const formattedTime = now.toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });

      schema.find('lead', id).update({ ...attrs, submitted: formattedTime });

      return schema.db.leads.find(id);
    });

  },
})