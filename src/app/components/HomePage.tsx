import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Shield, 
  Zap, 
  Eye, 
  TrendingUp, 
  Clock,
  CheckCircle,
  ArrowRight,
  Layers,
  Bell,
  Activity
} from 'lucide-react';
import { motion } from 'motion/react';

interface HomePageProps {
  onNavigateToDashboard: () => void;
}

const atmImages = [
  {
    url: 'https://images.unsplash.com/photo-1739065147235-3b246660c040?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBVE0lMjBtYWNoaW5lJTIwYmFua2luZ3xlbnwxfHx8fDE3NzExMzgzNjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Modern ATM Machine'
  },
  {
    url: 'https://images.unsplash.com/photo-1746826618149-7c54e99e7946?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5rJTIwQVRNJTIwY2FzaCUyMG1hY2hpbmV8ZW58MXx8fHwxNzcxMTM4MzYyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Bank ATM'
  },
  {
    url: 'https://images.unsplash.com/photo-1742796674961-a5e833a6f0c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBBVE0lMjB0b3VjaHNjcmVlbnxlbnwxfHx8fDE3NzExMzgzNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Touchscreen ATM'
  },
  {
    url: 'https://images.unsplash.com/photo-1611605862651-c91b8778ce01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwQVRNJTIwbmlnaHR8ZW58MXx8fHwxNzcxMTM4MzYyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Outdoor ATM'
  }
];

export function HomePage({ onNavigateToDashboard }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4" variant="secondary">
              AI-Powered Monitoring
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Next-Generation ATM Monitoring System
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Real-time anomaly detection, automated ticketing, and intelligent alerts 
              to keep your ATM network running smoothly 24/7
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={onNavigateToDashboard} className="gap-2">
                Access Dashboard
                <ArrowRight className="size-4" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Eye className="size-4" />
                Watch Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ATM Gallery with Hover Effects */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            Monitor Your ATM Network
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {atmImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -8 }}
                className="relative group cursor-pointer"
              >
                <div className="overflow-hidden rounded-xl shadow-lg">
                  <motion.img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-64 object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-medium">{image.alt}</p>
                      <p className="text-white/80 text-sm">Real-time monitoring</p>
                    </div>
                  </div>
                  <motion.div
                    className="absolute top-4 right-4 bg-green-500 rounded-full p-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <CheckCircle className="size-4 text-white" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center mb-4">
            Powerful Features
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Everything you need to manage your ATM network efficiently
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Eye,
                title: 'Real-Time Monitoring',
                description: 'Track all ATMs in real-time with live status updates and instant anomaly detection',
                color: 'bg-blue-500'
              },
              {
                icon: Bell,
                title: 'Smart Alerts',
                description: 'Get notified immediately when issues are detected with actionable insights',
                color: 'bg-red-500'
              },
              {
                icon: Zap,
                title: 'Auto Ticketing',
                description: 'Automated ticket generation with complete JSON payloads sent to your CRM',
                color: 'bg-yellow-500'
              },
              {
                icon: Activity,
                title: 'Health Analytics',
                description: 'Monitor cash levels, temperature, transactions, and uptime metrics',
                color: 'bg-green-500'
              },
              {
                icon: Shield,
                title: 'Security Monitoring',
                description: 'Detect unauthorized access attempts and potential security threats',
                color: 'bg-purple-500'
              },
              {
                icon: TrendingUp,
                title: 'Performance Insights',
                description: 'Track performance trends and optimize your ATM fleet efficiency',
                color: 'bg-indigo-500'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -4 }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                      <feature.icon className="size-6 text-white" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-white"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '99.9%', label: 'Uptime' },
              { value: '<1min', label: 'Detection Time' },
              { value: '24/7', label: 'Monitoring' },
              { value: '1000+', label: 'ATMs Managed' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-blue-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="max-w-3xl mx-auto text-center border-2">
            <CardHeader className="space-y-4 pt-12 pb-8">
              <div className="inline-flex p-4 bg-primary/10 rounded-full mx-auto">
                <Layers className="size-12 text-primary" />
              </div>
              <CardTitle className="text-3xl">
                Ready to Transform Your ATM Management?
              </CardTitle>
              <CardDescription className="text-lg">
                Join hundreds of organizations using our platform to monitor and manage their ATM networks
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-12">
              <Button size="lg" onClick={onNavigateToDashboard} className="gap-2">
                Get Started Now
                <ArrowRight className="size-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Activity className="size-5 text-primary" />
              <span className="font-semibold">ATM Monitor System</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Clock className="size-4" />
              <span>Real-time monitoring since 2024</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
