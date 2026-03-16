import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { CodeBlock } from "../components/ui/code-block";
import { DiffLine } from "../components/ui/diff-line";
import { Input } from "../components/ui/input";
import { LeaderboardRow } from "../components/ui/leaderboard-row";
import { ScoreRing } from "../components/ui/score-ring";
import { Toggle } from "../components/ui/toggle";

export default function ShowcasePage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">DevRoast Components Showcase</h1>

      {/* Button Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Button</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button>Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="submit">Submit</Button>
        </div>
      </section>

      {/* Badge Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Badge</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="good">Good</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </section>

      {/* Input Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Input</h2>
        <div className="max-w-md space-y-4">
          <Input type="text" placeholder="Default input" />
          <Input type="text" placeholder="Disabled input" disabled />
          <Input type="text" placeholder="Error input" className="border-red-500" />
        </div>
      </section>

      {/* Card Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Card</h2>
        <div className="max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here.</CardDescription>
            </CardHeader>
            <div className="p-5">
              <p>Card content area. This is where you put your main content.</p>
              <Button className="mt-4">Card Action</Button>
            </div>
          </Card>
        </div>
      </section>

      {/* CodeBlock Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">CodeBlock</h2>
        <div className="max-w-lg">
          <CodeBlock code="console.log('Hello, World!');" language="javascript" />
        </div>
      </section>

      {/* Toggle Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Toggle</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Toggle>Toggle Option 1</Toggle>
          <Toggle defaultChecked>Toggle Option 2 (Checked)</Toggle>
        </div>
      </section>

      {/* ScoreRing Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">ScoreRing</h2>
        <div className="flex flex-wrap gap-8 items-center">
          <ScoreRing score={75} size={120} />
          <ScoreRing score={45} size={150} />
          <ScoreRing score={90} size={180} />
        </div>
      </section>

      {/* DiffLine Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">DiffLine</h2>
        <div className="max-w-lg space-y-1">
          <DiffLine type="context" lineNumbers={{ old: 1, new: 1 }}>
            {`import React from "react";`}
          </DiffLine>
          <DiffLine type="added" lineNumbers={{ old: 2, new: 2 }}>
            {`import { useState } from "react";`}
          </DiffLine>
          <DiffLine type="removed" lineNumbers={{ old: 3, new: 3 }}>
            {`import { Component } from "react";`}
          </DiffLine>
          <DiffLine type="context" lineNumbers={{ old: 4, new: 4 }}>
            {`export default function App() {`}
          </DiffLine>
        </div>
      </section>

      {/* LeaderboardRow Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">LeaderboardRow</h2>
        <div className="max-w-2xl">
          <LeaderboardRow
            rank={1}
            score={9.5}
            code={`function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`}
            language="javascript"
          />
        </div>
      </section>
    </div>
  );
}
