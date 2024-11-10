"use client";

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const components: { title: string; href: string; description: string }[] = [
  {
    title: "在庫一覧",
    href: "/inventory",
    description: "現在の在庫状況を確認し、管理します。",
  },
  {
    title: "発注管理",
    href: "/orders",
    description: "新規発注の作成や既存の発注を管理します。",
  },
  {
    title: "使用履歴",
    href: "/usage-history",
    description: "アイテムの使用履歴を確認します。",
  },
  {
    title: "レポート",
    href: "/reports",
    description: "在庫や使用状況に関する各種レポートを生成します。",
  },
]

export default function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>在庫管理</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">
                      在庫管理システム
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      効率的な在庫管理を実現するための総合システム
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/dashboard" title="ダッシュボード">
                在庫状況の概要を一目で確認できます。
              </ListItem>
              <ListItem href="/items/new" title="新規アイテム登録">
                新しいアイテムを在庫リストに追加します。
              </ListItem>
              <ListItem href="/settings" title="設定">
                システムの各種設定を行います。
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>機能一覧</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/help" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              ヘルプ
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"