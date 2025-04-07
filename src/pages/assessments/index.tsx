import React from 'react';
import Head from 'next/head';
import Layout from '@/components/common/Layout';

export default function AssessmentsPage() {
  return (
    <Layout>
      <Head>
        <title>Assessments | SkillConnect</title>
        <meta name="description" content="Manage your skills assessments" />
      </Head>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Assessments</h1>
        </div>
        
        <div className="card border border-border">
          <h2 className="text-lg font-semibold mb-4">Skills Assessments</h2>
          <p>Create and manage skills assessments for your candidates.</p>
        </div>
      </div>
    </Layout>
  );
} 