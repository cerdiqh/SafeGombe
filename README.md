# GombeSafe Security Monitoring Platform

A comprehensive, offline-first security monitoring platform for Gombe State, Nigeria, providing real-time incident reporting, interactive heat maps, and community safety information.

## 🚨 Features

### Real-Time Security Monitoring
- **Interactive Heat Maps**: Real-time visualization of security incidents using Mapbox GL JS
- **GPS-Based Reporting**: Accurate location tracking for incident reports
- **Risk Level Visualization**: Color-coded threat levels (Critical, High, Medium, Low, Safe)
- **Real Security Data**: Based on actual Gombe State security reports and government sources

### Community Reporting
- **Anonymous Reporting**: Submit incidents without revealing identity
- **Photo Evidence**: Upload images with incident reports (max 5MB)
- **Multiple Incident Types**: Terrorism, banditry, cattle rustling, Kalare gang activity, kidnapping, armed robbery, suspicious activity
- **Location Selection**: GPS coordinates and descriptive location input

### Offline-First Architecture
- **Service Workers**: Full functionality without internet connection
- **Background Sync**: Automatic synchronization when connection is restored
- **Cached Data**: Critical security information available offline
- **Progressive Web App**: Installable on mobile devices

### Mobile-Optimized Design
- **Responsive Layout**: Works seamlessly on phones, tablets, and desktops
- **Touch-Friendly Interface**: Optimized for mobile reporting
- **Bottom Navigation**: Easy access to key features on mobile
- **Fast Loading**: Optimized for low-bandwidth connections

### Security Areas & Data
- **Bolari District**: High-risk area with Kalare gang activity and terrorism incidents
- **Billiri LGA**: Significant cattle rustling and banditry (18 suspects arrested, 483 cattle recovered)
- **Gombe Central**: Operation Hattara active zone with enhanced security patrols
- **Real Statistics**: Based on actual security reports and government data

## 🛡️ Operation Hattara Integration

The platform integrates with Operation Hattara, the special security taskforce meaning "be careful" in English:

- **28 Security Vehicles**: Deployed across Gombe State
- **Enhanced Patrols**: Active security presence in high-risk areas
- **Emergency Contacts**: Direct access to Operation Hattara hotline (123)
- **Real-Time Updates**: Current security status and deployment information

## 📱 Emergency Contacts

- **Police**: 199
- **Operation Hattara**: 123
- **Fire Service**: 199
- **Medical Emergency**: 199

## 🗺️ High-Risk Areas

### Bolari District (Critical Risk)
- Kalare gang violence and terrorism incidents
- Military barracks targeted in 2015 suicide bombing
- Ongoing gang violence and terrorism threats

### Billiri LGA (High Risk)
- Significant cattle rustling and banditry
- Recent arrests: 18 suspects, 483 cattle recovered
- Ongoing banditry and cattle rustling activities

### Gombe Central (Medium Risk)
- Operation Hattara active zone
- 28 security vehicles patrolling
- Enhanced police presence

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Mapbox account (for map functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ViteEdit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file
   VITE_MAPBOX_TOKEN=your_mapbox_token_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## 🏗️ Architecture

### Frontend (Client)
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **React Query** for data fetching and caching
- **Mapbox GL JS** for interactive maps

### Backend (Server)
- **Express.js** with TypeScript
- **In-memory storage** for fast performance
- **RESTful API** for incident management
- **Real-time data** synchronization

### Offline Support
- **Service Workers** for caching and offline functionality
- **IndexedDB** for local data storage
- **Background Sync** for automatic data synchronization
- **Progressive Web App** capabilities

## 📊 Data Structure

### Incident Types
- `terrorism` - Terrorist activities and threats
- `banditry` - Armed robbery and bandit attacks
- `cattle_rustling` - Livestock theft and related crimes
- `kalare_gangs` - Kalare gang activities and violence
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your Mapbox token
```

4. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Environment Variables

- `MAPBOX_TOKEN` - Mapbox access token for maps functionality
- `PORT` - Server port (default: 5000)

## Project Structure

```bash
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── dashboard/  # Dashboard components
│   │   │   ├── forms/      # Form components
│   │   │   ├── layout/     # Layout components
│   │   │   ├── map/        # Map components
│   │   │   ├── safety/     # Safety feature components
│   │   │   └── ui/         # UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility libraries
│   │   └── services/      # API service layers
├── server/                # Backend Express application
│   ├── routes/           # API route handlers
│   │   └── safety.ts     # Safety-specific routes
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # Main route definitions
│   └── storage.ts        # Database operations
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schema definitions
└── dist/                # Production build output
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema changes

## Key Features Implementation

### Incident Types
All incident types have been updated to reflect actual challenges in Gombe State:
- Removed inappropriate types (terrorism, banditry)
- Added relevant local incident types
- Updated icons and descriptions

### Emergency Services
- Accurate phone numbers for Gombe State services
- Local hospital and emergency service information
- Community security (Vigilante Group) integration

### Location Handling
- Robust fallback to Gombe coordinates
- Error handling for location services
- Consistent location data across all components

### Safety Recommendations
- Area-specific safety tips
- Local high-risk area alerts
- Culturally appropriate safety advice

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run check` for type checking
5. Run `npm run build` to ensure build works
6. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.

## Local Development Notes

- Server runs on port 5000 by default
- Frontend development server proxies to backend
- WebSocket connection for real-time updates
- SQLite database for local development
- All coordinates default to Gombe State location

## 🔒 Security & Privacy

### Data Protection
- Anonymous reporting option
- Secure data transmission
- Local data encryption
- No personal information collection

### Offline Security
- Encrypted local storage
- Secure service worker implementation
- Background sync security
- Data validation and sanitization

## 🌍 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
- `VITE_MAPBOX_TOKEN` - Mapbox access token for map functionality
- `NODE_ENV` - Environment (development/production)

### Docker Support (Future)
- Containerized deployment
- Multi-stage builds
- Production optimizations

## 📈 Future Enhancements

### Planned Features
- **Analytics Dashboard** - Advanced reporting and statistics
- **Push Notifications** - Real-time incident alerts
- **Multi-language Support** - Hausa and other local languages
- **AI-Powered Analysis** - Incident pattern recognition
- **Integration with Government Systems** - Official security data feeds

### Technical Improvements
- **Database Integration** - PostgreSQL/MySQL for production
- **Real-time Updates** - WebSocket connections
- **Advanced Caching** - Redis for performance
- **Monitoring & Logging** - Application performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Gombe State Government for security data and Operation Hattara information
- Mapbox for mapping services
- React and TypeScript communities
- Open source contributors

## 📞 Support

For support, questions, or incident reports:
- **Emergency**: 199 (Police) | 123 (Operation Hattara)
- **Technical Issues**: Create an issue in the repository
- **Security Concerns**: Contact local authorities immediately

---

**GombeSafe** - Keeping Gombe State secure through community reporting and real-time monitoring.

*Built with ❤️ for the safety and security of Gombe State communities.*
